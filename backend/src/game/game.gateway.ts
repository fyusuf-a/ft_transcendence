import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from './game';
import { MoveDto } from '@dtos/game/move.dto';
import { GameOptionsDto } from '@dtos/game/game-options.dto';
import { MatchesService } from 'src/matches/matches.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { SecureGateway, CheckAuth } from 'src/auth/auth.websocket';
import { MatchDto, MatchStatusType, UpdateMatchDto } from 'src/dtos/matches';
import { InjectRepository } from '@nestjs/typeorm';
import { Match } from 'src/matches/entities/match.entity';
import { Repository } from 'typeorm';
import { AchievementsLogService } from 'src/achievements-log/achievements-log.service';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway extends SecureGateway {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly configService: ConfigService,
    private readonly matchService: MatchesService,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    protected readonly achievementsLogService: AchievementsLogService,
  ) {
    super('GameGateway', usersService, configService);
  }

  @WebSocketServer() server: Server;

  games: Map<number, Game> = new Map(); // array of all active games (game state will only be stored in memory, which I think is fine)
  queues: Map<string, Array<Socket>> = new Map();

  @SubscribeMessage('game-move')
  @CheckAuth
  handleMove(client: Socket, move: MoveDto): string {
    const game = this.games.get(move.gameId);
    let player = -1;
    if (!game) {
      return 'Error: game not found';
    }
    if (client === game.players[0]) {
      player = 0;
    } else if (client === game.players[1]) {
      player = 1;
    } else {
      return 'Error: not a player';
    }
    if (game) {
      game.move(player, move.dy);
    }
    return 'Success';
  }

  @SubscribeMessage('game-queue')
  @CheckAuth
  async handleQueue(
    client: Socket,
    gameOptions: GameOptionsDto,
  ): Promise<string> {
    const clientUser = this.getAuthenticatedUser(client);
    let selectedQueue;
    const gameOptionsString = JSON.stringify(gameOptions);
    if (gameOptions.homeId || gameOptions.awayId) {
      if (
        clientUser.id !== gameOptions.homeId &&
        clientUser.id !== gameOptions.awayId
      ) {
        throw new WsException('Invalid Game Options');
      }
    }
    if (this.queues.has(gameOptionsString)) {
      selectedQueue = this.queues.get(gameOptionsString);
    } else {
      selectedQueue = new Array<Socket>();
      this.queues.set(gameOptionsString, selectedQueue);
    }
    if (selectedQueue.length > 0) {
      const otherPlayer = selectedQueue.shift();
      if (otherPlayer && otherPlayer.id !== client.id) {
        this.logger.log(`${otherPlayer.id} vs ${client.id} is being created`);
        const home = this.getAuthenticatedUser(otherPlayer);
        const away = this.getAuthenticatedUser(client);
        const match = await this.matchService.create({
          homeId: home.id,
          awayId: away.id,
        });
        const gameId = match.id;

        const newGame = new Game({ gameId: gameId }, this.server, this);
        newGame.players[0] = otherPlayer;
        newGame.players[1] = client;
        this.games.set(gameId, newGame);
        client.join(newGame.room);
        otherPlayer.join(newGame.room);
        this.server.to(newGame.room).emit('game-starting', newGame.gameId);
        newGame.startServer();
        return 'Success: starting game';
      } else {
        selectedQueue.unshift(otherPlayer);
        throw new WsException('Request already exists');
      }
    }
    selectedQueue.push(client);
    this.logger.log(
      `${client.id} joining queue with options ${JSON.stringify(gameOptions)}`,
    );
    return 'Success: joined queue';
  }

  async terminate_game(gameId: number, abort: number) {
    let status: MatchStatusType;
    let match: Match = await this.matchRepository.findOneBy({ id: gameId });

    if (abort) {
      status = MatchStatusType.ABORTED;
    } else {
      status = this.games.get(gameId).state.winner
        ? MatchStatusType.AWAY
        : MatchStatusType.HOME;

      this.achievementsLogService.handlePostMatch(
        await this.usersService.handlePostMatch(
          match,
          this.games.get(gameId).state,
        ),
      );
    }
    const dto: GameOptionsDto = { homeId: match.homeId, awayId: match.awayId };
    this.queues.delete(JSON.stringify(dto));
    this.logger.log(`Terminating game ${gameId} with status ${match.status}`);

    const update: UpdateMatchDto = { end: new Date(), status: status };
    await this.matchService.update(match, update);
    match = await this.matchRepository.findOneBy({ id: gameId });
    this.logger.log(`Terminating game ${gameId} with status ${status}`);
    if (this.games.get(gameId) && this.games.get(gameId).room) {
      this.server
        .to(this.games.get(gameId).room)
        .emit('endGame', match as MatchDto);
      this.games.delete(gameId);
    }
  }

  @SubscribeMessage('game-spectate')
  @CheckAuth
  handleSpectate(client: Socket, gameId: number): string {
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      client.join(gameId.toString());
      this.logger.log(`spectating game ${game.gameId}`);
      return 'Success';
    }
    return 'Error: game not found';
  }

  handleDisconnect(client: Socket) {
    // abandon active games, if applicable
    this.server.to(client.id).emit('game-disconnect', 'DISCONNECTED!');
    for (const gameMap of this.games) {
      for (const player of gameMap[1].players) {
        if (player && !player.connected) {
          gameMap[1].end(1);
        }
      }
    }
    super.handleDisconnect(client);
  }

  async handleConnection(client: Socket) {
    // register client
    this.server.to(client.id).emit('game-connect', 'CONNECTED!');
  }

  @SubscribeMessage('require-challenges')
  @CheckAuth
  async getChallenges(client: Socket) {
    const clientUser = this.getAuthenticatedUser(client);
    const array: Array<{
      opponentString: string;
      opponentId: number;
      id: number;
    }> = [];
    let i = 0;
    for (const [key, queue] of this.queues) {
      console.log(`found challenger: ${queue[1].id}`);
      if (JSON.parse(key).awayId == clientUser.id) {
        const opponentId: number = JSON.parse(key).homeId;
        const username: string = (await this.usersService.findOne(opponentId))
          .username;
        array.push({ opponentString: username, opponentId: opponentId, id: i });
        i++;
      }
    }
    client.emit('get-challenges', array);
  }
}
