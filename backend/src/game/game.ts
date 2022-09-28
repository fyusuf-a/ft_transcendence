import { Server, Socket } from 'socket.io';
import { CreateGameDto, StateDto } from '@dtos/game';
import { GameState } from './game-state';
import { Winner } from './game-state';
const FRAMERATE = 30;

export class Game {
  gameId: number;
  players: [Socket | undefined, Socket | undefined];
  server: Server;
  room: string;
  state: GameState;
  updateInterval: NodeJS.Timer;
  winner: Winner;

  constructor(init: CreateGameDto, server: Server) {
    this.gameId = init.gameId;
    this.state = new GameState();
    this.players = [undefined, undefined];
    this.server = server;
    this.room = init.gameId.toString();
    this.updateInterval = undefined;
    // this.winner = new Winner();
  }

  end() {
    clearInterval(this.updateInterval);
  }

  updateServer() {
    this.state.update();
    const state: StateDto = {
      ball: { x: this.state.ball.x, y: this.state.ball.y },
      player1: { x: this.state.players[0].x, y: this.state.players[0].y },
      player2: { x: this.state.players[1].x, y: this.state.players[1].y },
      scoreP1: { score: this.state.score[0] },
      scoreP2: { score: this.state.score[1] },
    };
    // if (0) {
    //   this.end();
    // }
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
