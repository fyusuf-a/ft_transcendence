import { Ball } from './ball';
import { Grid } from './grid';
import { Player, Direction } from './player';

const BALL_SPEED = 3.5;
const BALL_SIZE = 13;

const PADDLE_SPEED = 7.5;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export class GameState {
  grid: Grid;
  ball: Ball;
  players: [Player, Player];
  score: [number, number];

  constructor() {
    const paddle_width_offset = 10.0;
    const paddle_height_offset = 75.0;
    this.grid = new Grid();
    this.players = [
      new Player(
        paddle_width_offset,
        this.grid.height - PADDLE_HEIGHT - paddle_height_offset,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        this.grid,
        Direction.ToTheRight,
        PADDLE_SPEED,
      ),
      new Player(
        this.grid.width - PADDLE_WIDTH - paddle_width_offset,
        paddle_height_offset,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        this.grid,
        Direction.ToTheLeft,
        PADDLE_SPEED,
      ),
    ];
    this.ball = this.newBall();
    this.score = [0, 0];
  }

  get player1() {
    return this.players[0];
  }
  get player2() {
    return this.players[1];
  }

  newBall(): Ball {
    const startX = random(150, 390);
    const startY = random(100, 380);
    const startVx = startX < 320 ? BALL_SPEED : -BALL_SPEED;
    const startVy = random(-BALL_SPEED, BALL_SPEED);
    return new Ball(startX, startY, startVx, startVy, BALL_SIZE, this.grid);
  }

  move(player: number, dy: number) {
    this.players[player].move(dy);
  }

  collision_update() {
    const next_ball = this.ball;
    next_ball.x = this.ball.x + this.ball.dx;
    next_ball.y = this.ball.y + this.ball.dy;
    if (
      next_ball.left <= this.player1.edge &&
      next_ball.top > this.player1.bottom &&
      next_ball.bottom < this.player1.top
    )
      this.ball.invert_dx();
    if (
      next_ball.right >= this.player2.edge &&
      next_ball.top > this.player2.bottom &&
      next_ball.bottom < this.player2.top
    )
      this.ball.invert_dx();
  }

  update() {
    if (this.ball.x < this.player1.edge || this.ball.x > this.player2.edge) {
      // ENDING THE POINT
      if (this.ball.x < this.player1.edge)
        console.log('Player 2 gets the point');
      else console.log('Player 1 gets the point');
      this.ball = this.newBall();
      return;
    }
    this.players[0].update();
    this.players[1].update();
    this.collision_update();
    this.ball.update();
  }
}
