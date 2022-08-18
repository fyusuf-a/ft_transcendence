import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { StateDto } from '@dtos/game/state.dto';
import { Game } from './game';
import { MoveDto } from '@dtos/game/move.dto';
import { CreateGameDto } from '@dtos/game/create-game.dto';
import { MatchesService } from 'src/matches/matches.service';

@WebSocketGateway({ cors: true, namespace: 'game' })
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private matchService: MatchesService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('GameGateway');
  games: Map<number, Game> = new Map(); // array of all active games (game state will only be stored in memory, which I think is fine)
  queue: Array<Socket> = [];

  @SubscribeMessage('game-state')
  handleState(client: Socket, state: StateDto): string {
    // this.logger.log(JSON.stringify(state));
    // if client is player in move.gameId
    const game = this.games.get(state.gameId);
    if (!game) {
      return 'Error: game not found';
    }
    this.server.to(game.room).emit('game-state', state);
    return 'Success';
  }

  @SubscribeMessage('game-move')
  handleMove(client: Socket, move: MoveDto): string {
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

  @SubscribeMessage('game-create')
  handeCreate(client: Socket, game: CreateGameDto): string {
    // should create Match and use Match.id as the game id
    this.logger.log(`creating game ${game.gameId}`);
    this.logger.log(`player1 ${client.id}`);
    if (this.games.has(game.gameId)) {
      return 'Error: game already exists';
    }
    game.room = game.gameId.toString();
    // game.server = this.server;
    const new_game = new Game(game, this.server);
    new_game.players[0] = client;
    this.games.set(game.gameId, new_game);
    client.join(game.room);
    return 'Success';
  }

  @SubscribeMessage('game-queue')
  async handeQueue(
    client: Socket,
    gameOptions: CreateGameDto,
  ): Promise<string> {
    gameOptions.gameId = -1; // handle game options here instead
    if (this.queue.length > 0) {
      const otherPlayer = this.queue.shift();
      if (otherPlayer) {
        this.logger.log(`${otherPlayer.id} vs ${client.id} is being created`);
        const match = await this.matchService.create({ homeId: 1, awayId: 2 });
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
      }
    }
    this.queue.push(client);
    this.logger.log(`${client.id} joining queue`);
    return 'Success: joined queue';
  }

  @SubscribeMessage('game-join')
  handeJoin(client: Socket, gameId: number): string {
    // eventually we need to use whatever matchmaking system that we develop
    // or allow a user to join a 'challenge' against a specific user
    if (!this.games.has(gameId)) {
      return 'Error: game not found';
    }
    const game = this.games.get(gameId);
    if (game.players[1]) {
      return 'Error: game full';
    }
    game.players[1] = client;
    client.join(game.room);
    this.logger.log(`joining game ${game.gameId}`);
    this.logger.log(`player2 ${client.id}`);
    game.startServer();
    return 'Success';
  }

  @SubscribeMessage('game-spectate')
  handleSpectate(client: Socket, gameId: number): string {
    // add socket to game room
    if (this.games.has(gameId)) {
      const game = this.games.get(gameId);
      client.join(gameId.toString());
      this.logger.log(`spectating game ${game.gameId}`);
      return 'Success';
    }
    return 'Error: game not found';
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
