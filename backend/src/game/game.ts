import { Server, Socket } from 'socket.io';
import { CreateGameDto } from '@dtos/game/create-game.dto';
import { CheckResult, GameState, Winner } from './game-state';
import { Ball } from './ball';

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
    this.room = init.room;
    this.updateInterval = undefined;
  }

  start() {
    this.update();
  }

  end() {
    clearInterval(this.updateInterval);
  }

  collision_update() {
    const player1_edge =
      this.state.players[0].get_x() + this.state.players[0].get_width(); //right edge
    const player1_top = this.state.players[0].get_y();
    const player1_bottom = player1_top + this.state.players[0].get_height();
    const player2_edge = this.state.players[1].get_x(); //left edge
    const player2_top = this.state.players[1].get_y();
    const player2_bottom = player2_top + this.state.players[1].get_height();

    if (
      this.state.ball.get_x() < player1_edge ||
      this.state.ball.get_x() > player2_edge
    ) {
      // ENDING THE POINT
      if (this.state.ball.get_x() < player1_edge) {
        console.log('Player 2 gets the point');
      } else {
        console.log('Player 1 gets the point');
      }
      this.state.ball = new Ball();
    }

    const next_ball_x = this.state.ball.get_x() + this.state.ball.get_dx();
    const next_ball_y = this.state.ball.get_y() + this.state.ball.get_dy();
    if (next_ball_y < 0 || next_ball_y + this.state.ball.get_size() > 480)
      // WALLS COLLISION
      this.state.ball.invert_dy();
    if (
      next_ball_x <= player1_edge &&
      next_ball_y >= player1_top &&
      next_ball_y <= player1_bottom
    )
      this.state.ball.invert_dx();
    if (
      next_ball_x + this.state.ball.get_size() >= player2_edge &&
      next_ball_y >= player2_top &&
      next_ball_y <= player2_bottom
    )
      this.state.ball.invert_dx();
  }

  updateServer() {
    this.state.players[0].update();
    this.state.players[1].update();
    this.collision_update();
    this.state.ball.update();
    // this.state.ball.x += 1;
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

  nextCollision(): number {
    // calculate time until the ball arrives at one side or the other
    if (this.state.ball.x < this.state.players[0].width) {
      return this.state.ball.x / Math.abs(this.state.ball.dx); // dt = dx / vx
    } else if (
      this.state.ball.x >
      this.state.grid.width - this.state.players[1].width
    ) {
      return (this.state.grid.width - this.state.ball.x) / this.state.ball.dx;
    } else if (this.state.ball.dx < 0) {
      return (
        (this.state.ball.x - this.state.players[0].width) /
        Math.abs(this.state.ball.dx)
      ); // dt = dx / vx
    } else {
      return (
        (this.state.grid.width -
          this.state.ball.x -
          this.state.players[1].width) /
        this.state.ball.dx
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
