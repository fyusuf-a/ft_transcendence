import { Server, Socket } from 'socket.io';
import { CreateGameDto } from '@dtos/game/create-game.dto';
import { GameState } from './game-state';

const FRAMERATE = 30;

export class Game {
  gameId: number;
  players: [Socket | undefined, Socket | undefined];
  server: Server;
  room: string;
  state: GameState;
  updateInterval: any;

  constructor(init: CreateGameDto, server: Server) {
    this.gameId = init.gameId;
    this.state = new GameState();
    this.players = [undefined, undefined];
    this.server = server;
    this.room = init.gameId.toString();
    this.updateInterval = undefined;
  }

  end() {
    clearInterval(this.updateInterval);
  }

  updateServer() {
    this.state.update();
    const state = {
      ball: { x: this.state.ball.x, y: this.state.ball.y },
      player1: { x: this.state.players[0].x, y: this.state.players[0].y },
      player2: { x: this.state.players[1].x, y: this.state.players[1].y },
    };
    this.server.to(this.room).emit('game-state', state);
  }

  startServer() {
    console.log('starting server');
    this.updateInterval = setInterval(
      () => this.updateServer(),
      1000 / FRAMERATE,
    );
  }

  move(player: number, dy: number) {
    this.state.move(player, dy);
  }
}
