import { Socket } from 'socket.io-client';
import { StateDto } from '@dtos/game/state.dto';
import { Background } from './background';
import { BackgroundBH } from './background-black-hole';
import { Ball } from './ball';
import { Score } from './score';
import { Paddle } from './paddle';

const FRAMERATE = 30;

class Pong {
  canvas: HTMLCanvasElement | null;
  ballCanvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D;
  background: Background;
  backgroundLight: BackgroundBH;
  ball: Ball;
  scoreP1: Score;
  scoreP2: Score;
  player1: Paddle;
  player2: Paddle;
  winner: number;
  requestID: number | undefined;
  socket: Socket;
  lastUpdate: number;
  running = true;
  gameOptions: number;
  map: number;

  constructor(
    pongCanvas: HTMLCanvasElement | null,
    ballCanvas: HTMLCanvasElement | null,
    backgroundCanvas: HTMLCanvasElement | null,
    backgroundBH: HTMLCanvasElement | null,
    paddleCanvas: HTMLCanvasElement | null,
    scoreCanvas: HTMLCanvasElement | null,
    socket: Socket,
    map: number,
  ) {
    this.ballCanvas = ballCanvas;
    this.canvas = pongCanvas;
    this.ctx = this?.canvas?.getContext('2d') as CanvasRenderingContext2D;
    this.background = new Background(backgroundCanvas);
    this.backgroundLight = new BackgroundBH(backgroundBH);
    this.ball = new Ball(ballCanvas);
    this.player1 = new Paddle(10.0, 320.0, 'z', 's', paddleCanvas);
    this.player2 = new Paddle(
      620.0,
      75.0,
      'ArrowUp',
      'ArrowDown',
      paddleCanvas,
    );
    this.scoreP1 = new Score(0, 130, 0, scoreCanvas);
    this.scoreP2 = new Score(0, 450, 0, scoreCanvas);
    this.requestID = undefined;
    this.winner = -1;
    this.socket = socket;
    this.lastUpdate = -1;
    this.gameOptions = 0;
    this.map = map;
  }

  render() {
    if (this.map) {
      this.backgroundLight.render(this.ctx);
    } else {
      this.background.render(this.ctx);
    }
    this.scoreP1.render(this.ctx);
    this.scoreP2.render(this.ctx);
    this.ball.render(this.ctx);
    this.player1.render(this.ctx);
    this.player2.render(this.ctx);
  }

  execSpectateFrame(timestamp: number) {
    if (!this.running) return;
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
    this.scoreP1.score = newState.scoreP1.score;
    this.scoreP2.score = newState.scoreP2.score;
    this.ball.x = newState.ball.x;
    this.ball.y = newState.ball.y;
    this.winner = newState.winner;
  }
  spectate(gameId: number) {
    this.socket.on('game-state', (e) => this.updateState(e));
    this.socket.on('endGame', () => (this.running = false));
    this.socket.emit('game-spectate', gameId);
    this.execSpectateFrame(-1);
  }
}

export { Pong };
