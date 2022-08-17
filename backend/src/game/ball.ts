const SPEED = 3.5;
const BALL_SIZE = 13;

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export class Ball {
  x: number; // x position
  y: number; // y position
  dx: number; // x velocity
  dy: number; // y velocity
  size: number; // size of the ball (probably constant, but maybe changed by options or powerups)

  constructor() {
    this.size = BALL_SIZE;
    this.x = random(150, 390);
    this.y = random(100, 380);
    this.dx = this.x < 320 ? SPEED : -SPEED;
    this.dy = random(-SPEED, SPEED);
  }

  get_size() {
    return this.size;
  }
  get_x() {
    return this.x;
  }
  get_y() {
    return this.y;
  }
  get_dx() {
    return this.dx;
  }
  get_dy() {
    return this.dy;
  }

  invert_dy() {
    this.dy *= -1;
  }

  invert_dx() {
    this.dx *= -1;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }
}
