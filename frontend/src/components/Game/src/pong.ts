import { Socket } from 'socket.io-client';
import { StateDto } from '@dtos/game/state.dto';
import { Background } from './background';
import { Ball } from './ball';
import { Paddle } from './paddle';

const FRAMERATE = 20;

class Pong {
  canvas: HTMLCanvasElement | null;
  ballCanvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  background: Background;
  ball: Ball;
  player1: Paddle;
  player2: Paddle;
  requestID: number | undefined;
  socket: Socket;
  lastUpdate: number;

  constructor(
    pongCanvas: HTMLCanvasElement | null,
    ballCanvas: HTMLCanvasElement | null,
    backgroundCanvas: HTMLCanvasElement | null,
    paddleCanvas: HTMLCanvasElement | null,
    socket: Socket,
  ) {
    this.ballCanvas = ballCanvas;
    this.canvas = pongCanvas;
    this.ctx = this?.canvas?.getContext('2d') as CanvasRenderingContext2D;
    this.background = new Background(backgroundCanvas);
    this.ball = new Ball(ballCanvas);
    this.player1 = new Paddle(10.0, 320.0, 'z', 's', paddleCanvas);
    this.player2 = new Paddle(
      620.0,
      75.0,
      'ArrowUp',
      'ArrowDown',
      paddleCanvas,
    );
    this.requestID = undefined;
    this.socket = socket;
    this.lastUpdate = -1;
  }

  collision_update() {
    const player1_edge = this.player1.get_x() + this.player1.get_width(); //right edge
    const player1_top = this.player1.get_y();
    const player1_bottom = player1_top + this.player1.get_height();
    const player2_edge = this.player2.get_x(); //left edge
    const player2_top = this.player2.get_y();
    const player2_bottom = player2_top + this.player2.get_height();

    if (this.ball.get_x() < player1_edge || this.ball.get_x() > player2_edge) {
      // ENDING THE POINT
      if (this.ball.get_x() < player1_edge) {
        console.log('Player 2 gets the point');
      } else {
        console.log('Player 1 gets the point');
      }
      this.ball = new Ball(this.ballCanvas);
    }

    const next_ball_x = this.ball.get_x() + this.ball.get_dx();
    const next_ball_y = this.ball.get_y() + this.ball.get_dy();
    if (next_ball_y < 0 || next_ball_y + this.ball.get_size() > 480)
      // WALLS COLLISION
      this.ball.invert_dy();
    if (
      next_ball_x <= player1_edge &&
      next_ball_y >= player1_top &&
      next_ball_y <= player1_bottom
    )
      this.ball.invert_dx();
    if (
      next_ball_x + this.ball.get_size() >= player2_edge &&
      next_ball_y >= player2_top &&
      next_ball_y <= player2_bottom
    )
      this.ball.invert_dx();
  }

  update() {
    this.player1.update();
    this.player2.update();
    this.collision_update();
    this.ball.update();
  }

  render() {
    this.background.render(this.ctx);
    this.ball.render(this.ctx);
    this.player1.render(this.ctx);
    this.player2.render(this.ctx);
  }

  sendState() {
    // console.log("sending state")
    this.socket.emit('game-state', {
      gameId: 1,
      ball: { x: this.ball.x, y: this.ball.y },
      player1: { x: this.player1.x, y: this.player1.y },
      player2: { x: this.player2.x, y: this.player2.y },
    });
  }

  execFrame() {
    this.update();
    this.render();
    this.sendState();
  }

  start(timestamp: number) {
    if (timestamp > this.lastUpdate + 1000 / FRAMERATE) {
      this.lastUpdate = timestamp;
      this.execFrame();
    }
    this.requestID = requestAnimationFrame(this.start.bind(this));
  }

  execSpectateFrame(timestamp: number) {
    if (timestamp > this.lastUpdate + 1000 / FRAMERATE) {
      this.lastUpdate = timestamp;
      this.render();
    }
    this.requestID = requestAnimationFrame(this.execSpectateFrame.bind(this));
  }

  updateState(newState: StateDto) {
    if (!newState) return;
    this.player1.x = newState.player1.x;
    this.player1.y = newState.player1.y;
    this.player2.x = newState.player2.x;
    this.player2.y = newState.player2.y;
    this.ball.x = newState.ball.x;
    this.ball.y = newState.ball.y;
  }

  spectate() {
    this.socket.on('game-state', (e) => this.updateState(e));
    this.socket.emit('game-spectate', 1);
    this.execSpectateFrame(-1);
  }
}

export { Pong };
