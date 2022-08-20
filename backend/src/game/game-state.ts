import { Ball } from './ball';
import { Grid } from './grid';
import { Player } from './player';

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
        PADDLE_SPEED,
      ),
      new Player(
        this.grid.width - PADDLE_WIDTH - paddle_width_offset,
        paddle_height_offset,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        PADDLE_SPEED,
      ),
    ];
    this.ball = this.newBall();
    this.score = [0, 0];
  }

  newBall(): Ball {
    const startX = random(150, 390);
    const startY = random(100, 380);
    const startVx = startX < 320 ? BALL_SPEED : -BALL_SPEED;
    const startVy = random(-BALL_SPEED, BALL_SPEED);
    return new Ball(startX, startY, startVx, startVy, BALL_SIZE);
  }

  move(player: number, dy: number) {
    this.players[player].move(dy);
  }

  collision_update() {
    if (this.players[0].get_y() < 0) {
      this.players[0].y = 0;
    }
    if (
      this.players[0].get_y() >
      this.grid.height - this.players[0].get_height()
    ) {
      this.players[0].y = this.grid.height - this.players[0].get_height();
    }
    if (this.players[1].get_y() < 0) {
      this.players[1].y = 0;
    }
    if (
      this.players[1].get_y() >
      this.grid.height - this.players[1].get_height()
    ) {
      this.players[1].y = this.grid.height - this.players[1].get_height();
    }

    const player1_edge = this.players[0].get_x() + this.players[0].get_width(); //right edge
    const player1_top = this.players[0].get_y();
    const player1_bottom = player1_top + this.players[0].get_height();
    const player2_edge = this.players[1].get_x(); //left edge
    const player2_top = this.players[1].get_y();
    const player2_bottom = player2_top + this.players[1].get_height();

    if (this.ball.get_x() < player1_edge || this.ball.get_x() > player2_edge) {
      // ENDING THE POINT
      if (this.ball.get_x() < player1_edge) {
        console.log('Player 2 gets the point');
      } else {
        console.log('Player 1 gets the point');
      }
      this.ball = this.newBall();
    }

    const next_ball_x = this.ball.get_x() + this.ball.get_dx();
    const next_ball_y = this.ball.get_y() + this.ball.get_dy();
    if (
      next_ball_y < 0 ||
      next_ball_y + this.ball.get_size() > this.grid.height
    )
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
    this.players[0].update();
    this.players[1].update();
    this.collision_update();
    this.ball.update();
  }
}
