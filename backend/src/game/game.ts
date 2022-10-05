import { Server, Socket } from 'socket.io';
import { CreateGameDto, StateDto } from '@dtos/game';
import { GameState, SCORE_TO_WIN } from './game-state';
import { Inject } from '@nestjs/common';
import { GameGateway } from './game.gateway';
const FRAMERATE = 30;

export class Game {
  gameId: number;
  players: [Socket | undefined, Socket | undefined];
  server: Server;
  room: string;
  state: GameState;
  updateInterval: NodeJS.Timer;
  gameMode: number;

  constructor(
    init: CreateGameDto,
    server: Server,
    @Inject(GameGateway)
    private readonly gameGateway: GameGateway,
  ) {
    this.gameId = init.gameId;
    this.state = new GameState();
    this.players = [undefined, undefined];
    this.server = server;
    this.room = init.gameId.toString();
    this.updateInterval = undefined;
    this.gameMode = 0;
  }

  end(abort: number) {
    clearInterval(this.updateInterval);
    //this.server.to(this.room).emit('gameOver');
    this.gameGateway.terminate_game(this.gameId, abort);
  }

  updateServer() {
    this.state.update();
    const state: StateDto = {
      ball: { x: this.state.ball.x, y: this.state.ball.y },
      player1: { x: this.state.players[0].x, y: this.state.players[0].y },
      player2: { x: this.state.players[1].x, y: this.state.players[1].y },
      scoreP1: { score: this.state.score[0] },
      scoreP2: { score: this.state.score[1] },
      winner: this.state.winner,
      gameMode: this.gameMode,
    };
    this.state.gameMode = this.gameMode;

    if (
      this.state.score[0] == SCORE_TO_WIN ||
      this.state.score[1] == SCORE_TO_WIN
    ) {
      this.end(0);
    }
    this.server.to(this.room).emit('game-state', state);
  }

  startServer() {
    this.updateInterval = setInterval(
      () => this.updateServer(),
      1000 / FRAMERATE,
    );
  }

  move(player: number, dy: number) {
    this.state.move(player, dy);
  }
}
