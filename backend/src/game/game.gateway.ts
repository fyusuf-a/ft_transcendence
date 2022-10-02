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
import { MatchDto, MatchStatusType } from 'src/dtos/matches';
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
    let test = gameOptions.gameMode;
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
        console.log("heyeheye: " + test);
    return 'Success: joined queue';
  }

  async terminate_game(gameId: number) {
    const match: MatchDto = await this.matchService.findOne(gameId);
    match.end = new Date();
    if (match.status == MatchStatusType.IN_PROGRESS) {
      match.status = this.games.get(gameId).state.winner
        ? MatchStatusType.AWAY
        : MatchStatusType.HOME;
      await this.matchRepository.save(match);
      this.achievementsLogService.handlePostMatch(
        await this.usersService.handlePostMatch(
          match,
          this.games.get(gameId).state,
        ),
      );
    };
    this.logger.log(`Terminating game ${gameId} with status ${match.status}`);
    if (this.games.get(gameId) && this.games.get(gameId).room) {
      this.server
        .to(this.games.get(gameId).room)
        .emit('endGame', match as MatchDto);
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
          gameMap[1].end();
          this.games.delete(gameMap[0]);
        }
      }
    }
    super.handleDisconnect(client);
  }

  async handleConnection(client: Socket) {
    // register client
    this.server.to(client.id).emit('game-connect', 'CONNECTED!');
  }
}
