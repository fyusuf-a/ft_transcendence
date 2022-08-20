export class Ball {
  x: number; // x position
  y: number; // y position
  vx: number; // x velocity
  vy: number; // y velocity
  size: number; // size of the ball (probably constant, but maybe changed by options or powerups)

  constructor(x: number, y: number, vx: number, vy: number, size: number) {
    this.size = size;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
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
    return this.vx;
  }
  get_dy() {
    return this.vy;
  }

  invert_dy() {
    this.vy *= -1;
  }

  invert_dx() {
    this.vx *= -1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
