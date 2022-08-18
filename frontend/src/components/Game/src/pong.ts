import { Socket } from 'socket.io-client';
import { StateDto } from '@dtos/game/state.dto';
import { Background } from './background';
import { Ball } from './ball';
import { Paddle } from './paddle';

const FRAMERATE = 30;

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

  render() {
    this.background.render(this.ctx);
    this.ball.render(this.ctx);
    this.player1.render(this.ctx);
    this.player2.render(this.ctx);
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

  spectate(gameId: number) {
    this.socket.on('game-state', (e) => this.updateState(e));
    this.socket.emit('game-spectate', gameId);
    this.execSpectateFrame(-1);
  }
}

export { Pong };