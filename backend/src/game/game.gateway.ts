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
import { NotificationsGateway } from 'src/notifications.gateway';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway extends SecureGateway {
  constructor(
    protected readonly usersService: UsersService,
    protected readonly configService: ConfigService,
    private readonly matchService: MatchesService,
    private readonly notificationsGateway: NotificationsGateway,
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
      this.notificationsGateway.handleNewChallenge(gameOptions.homeId, gameOptions.awayId); //does it work the second time around ??
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

        const newGame = new Game({ gameId: gameId }, this.server);
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
