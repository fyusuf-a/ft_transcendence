import { Server, Socket } from 'socket.io';
import { CreateGameDto } from '@dtos/game/create-game.dto';
import { CheckResult, GameState, Winner } from './game-state';

export class Game {
  gameId: number;
  players: [Socket | undefined, Socket | undefined];
  server: Server;
  room: string;
  state: GameState;

  constructor(init: CreateGameDto, server: Server) {
    this.gameId = init.gameId;
    this.state = new GameState();
    this.players = [undefined, undefined];
    this.server = server;
    this.room = init.room;
  }

  start() {
    this.update();
  }

  nextCollision(): number {
    // calculate time until the ball arrives at one side or the other
    if (this.state.ball.x < this.state.players[0].width) {
      return this.state.ball.x / Math.abs(this.state.ball.vx); // dt = dx / vx
    } else if (
      this.state.ball.x >
      this.state.grid.width - this.state.players[1].width
    ) {
      return (this.state.grid.width - this.state.ball.x) / this.state.ball.vx;
    } else if (this.state.ball.vx < 0) {
      return (
        (this.state.ball.x - this.state.players[0].width) /
        Math.abs(this.state.ball.vx)
      ); // dt = dx / vx
    } else {
      return (
        (this.state.grid.width -
          this.state.ball.x -
          this.state.players[1].width) /
        this.state.ball.vx
      );
    }
  }

  move(player: number, dy: number) {
    this.state.move(player, dy);
  }

  update() {
    if (!this.players[0].connected || !this.players[1].connected) {
      this.server.to(this.room).emit('game-winner', {
        player: this.state.winner,
        reason: 'disconnection',
      });
      this.state.winner = Winner.ABORTED;
    }
    const ret = this.state?.checkForPoints();
    if (ret !== CheckResult.NONE) {
      if (this.state?.winner !== Winner.TBD) {
        this.server
          .to(this.room)
          .emit('game-winner', { player: this.state.winner, reason: 'scored' });
        return;
      } else {
        this.server.to(this.room).emit('game-score', { player: ret });
      }
    }
    this.server.to(this.room).emit('game-state', this.state);
    // clear existing timeout, if it exists
    // use nextCollision() to calculate next hit/loss
    // const delta_t = this.nextCollision();
    // and set a timeout for that time to update again
    setTimeout(this.update.bind(this), 1000);
  }
}
