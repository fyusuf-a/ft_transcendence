import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
import { User } from 'src/users/entities/user.entity';
import { TokenUserDto } from '@dtos/auth';
import { UsersService } from 'src/users/users.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private matchService: MatchesService,
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');
  private authenticatedSockets: Map<string, User> = new Map();
  games: Map<number, Game> = new Map(); // array of all active games (game state will only be stored in memory, which I think is fine)
  queues: Map<string, Array<Socket>> = new Map();

  private checkAuth(client: Socket): boolean {
    if (
      this.configService.get<string>('DISABLE_AUTHENTICATION') == 'true' ||
      this.authenticatedSockets.has(client.id)
    ) {
      return true;
    }
    throw new WsException('Not Authorized');
  }

  @SubscribeMessage('game-move')
  handleMove(client: Socket, move: MoveDto): string {
    this.checkAuth(client);
    // if client is player in move.gameId
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
      this.logger.log('moving player');
      game.move(player, move.dy);
    }
    return 'Success';
  }

  @SubscribeMessage('game-queue')
  async handeQueue(
    client: Socket,
    gameOptions: GameOptionsDto,
  ): Promise<string> {
    this.checkAuth(client);
    const clientUser = this.authenticatedSockets.get(client.id);
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
        const home = this.authenticatedSockets.get(otherPlayer.id);
        const away = this.authenticatedSockets.get(client.id);
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
  handleSpectate(client: Socket, gameId: number): string {
    // add socket to game room
    this.checkAuth(client);
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      client.join(gameId.toString());
      this.logger.log(`spectating game ${game.gameId}`);
      return 'Success';
    }
    return 'Error: game not found';
  }

  @SubscribeMessage('game-auth')
  async handleAuth(client: Socket, payload: any) {
    this.logger.log(
      `Client ${client.id} is trying to auth socket with token: ${payload.authorization}`,
    );
    try {
      const token = payload.authorization;
      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await this.usersService.findOne(
        +(decode as TokenUserDto).id,
      );
      if (!user) {
        throw new WsException('Invalid Token');
      }
      this.authenticatedSockets.set(client.id, user);
      return 'SUCCESS';
    } catch (err) {
      this.authenticatedSockets.delete(client.id);
      throw new WsException('Not Authorized');
    }
  }

  afterInit() {
    // setup games or anything else that needs to be done
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
  }

  async handleConnection(client: Socket) {
    // register client
    this.server.to(client.id).emit('game-connect', 'CONNECTED!');
  }
}
