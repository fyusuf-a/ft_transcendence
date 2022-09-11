import { Ball } from './ball';
import { Grid } from './grid';
import { Player, Direction } from './player';

export enum Winner {
  TBD = -1,
  PLAYER_0 = 0,
  PLAYER_1 = 1,
  ABORTED,
}

export enum CheckResult {
  NONE = 0, // no score
  PLAYER_0, // player 0 scored
  PLAYER_1, // player 1 scored
}

const BALL_SPEED = 3.5;
const BALL_SIZE = 13;

const PADDLE_SPEED = 7.5;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

export const SCORE_TO_WIN = 5;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export class GameState {
  grid: Grid;
  ball: Ball;
  players: [Player, Player];
  score: [number, number];
  winner: Winner;
  lastResult: CheckResult;

  constructor() {
    const paddle_width_offset = 10.0;
    this.grid = new Grid();
    this.players = [
      new Player(
        paddle_width_offset,
        (this.grid.height - PADDLE_HEIGHT) / 2,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        this.grid,
        Direction.ToTheRight,
        PADDLE_SPEED,
      ),
      new Player(
        this.grid.width - PADDLE_WIDTH - paddle_width_offset,
        (this.grid.height - PADDLE_HEIGHT) / 2,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        this.grid,
        Direction.ToTheLeft,
        PADDLE_SPEED,
      ),
    ];
    this.ball = this.newBall();
    this.score = [0, 0];
    this.winner = Winner.TBD;
    this.lastResult = CheckResult.NONE;
  }

  get player0() {
    return this.players[0];
  }
  get player1() {
    return this.players[1];
  }

  newBall(): Ball {
    const x = this.grid.width / 2;
    const y = random(0, this.grid.height - BALL_SIZE);
    const vy = random(-BALL_SPEED, BALL_SPEED);
    let vx: number;
    switch (this.lastResult) {
      case CheckResult.PLAYER_0:
        vx = -BALL_SPEED;
        break;
      case CheckResult.PLAYER_1:
        vx = BALL_SPEED;
        break;
      default:
        vx = Math.random() < 0.5 ? -BALL_SPEED : BALL_SPEED;
    }
    return new Ball(x, y, vx, vy, BALL_SIZE, this.grid);
  }

  move(player: number, dy: number) {
    this.players[player].move(dy);
  }

  collision_update(): boolean {
    const next_ball = this.ball;
    next_ball.x = this.ball.x + this.ball.vx;
    next_ball.y = this.ball.y + this.ball.vy;
    if (
      next_ball.left <= this.player0.edge &&
      next_ball.top >= this.player0.bottom &&
      next_ball.bottom <= this.player0.top
    ) {
      this.ball.x = 2 * this.player0.edge - next_ball.left;
      this.ball.y += this.ball.vy;
      this.ball.invert_dx();
      return true;
    }
    if (
      next_ball.right >= this.player1.edge &&
      next_ball.top >= this.player1.bottom &&
      next_ball.bottom <= this.player1.top
    ) {
      this.ball.x = 2 * this.player1.edge - next_ball.right;
      this.ball.y += this.ball.vy;
      this.ball.invert_dx();
      return true;
    }
    return false;
  }

  checkForPoints() {
    this.lastResult = CheckResult.NONE;
    if (this.ball.right < this.player0.edge) {
      this.score[1] += 1;
      this.lastResult = CheckResult.PLAYER_1;
      this.ball = this.newBall();
    }
    if (this.ball.left > this.player1.edge) {
      this.score[0] += 1;
      this.lastResult = CheckResult.PLAYER_0;
      this.ball = this.newBall();
    }
    if (this.score[0] >= SCORE_TO_WIN) {
      this.winner = Winner.PLAYER_0;
    } else if (this.score[1] >= SCORE_TO_WIN) {
      this.winner = Winner.PLAYER_1;
    }
  }

  update() {
    this.players[0].update();
    this.players[1].update();
    if (this.collision_update() === false) this.ball.update();
    this.checkForPoints();
  }
}
