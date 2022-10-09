import { Grid } from './grid';

export class Ball {
  #grid: Grid;
  #x: number; // x position
  #y: number; // y position
  #vx: number; // x velocity
  #vy: number; // y velocity
  #size: number; // size of the ball

  constructor(
    x: number,
    y: number,
    vx: number,
    vy: number,
    size: number,
    grid: Grid,
  ) {
    this.#size = size;
    this.#x = x;
    this.#y = y;
    this.#vx = vx;
    this.#vy = vy;
    this.#grid = grid;
  }

  new_trajectory(py, bs) {
    const interY = py + 50 - this.y;
    const normalInterY = interY / (100 / 2);
    const bounceAngle = normalInterY * 1.309; // 1.309rad  = 75deg
    //this.dx = SPEED * Math.cos(bounceAngle);
    this.vy = bs * -Math.sin(bounceAngle);

    this.invert_dx();
  }

  get size() {
    return this.#size;
  }
  get x() {
    return this.#x;
  }
  set x(x: number) {
    this.#x = x;
  }
  get y() {
    return this.#y;
  }
  set y(y: number) {
    if (y < 0) {
      this.#y = -y;
      this.invert_dy();
    } else if (y > this.#grid.height - this.#size) {
      this.#y = 2 * (this.#grid.height - this.#size) - y;
      this.invert_dy();
    } else this.#y = y;
  }
  get left() {
    return this.#x;
  }
  get right() {
    return this.#x + this.#size;
  }
  get top() {
    return this.#y + this.#size;
  }
  get bottom() {
    return this.#y;
  }
  get vx() {
    return this.#vx;
  }
  set vx(vx: number) {
    this.#vx = vx;
  }
  get vy() {
    return this.#vy;
  }
  set vy(vy: number) {
    this.#vy = vy;
  }

  invert_dy() {
    this.#vy *= -1;
  }

  invert_dx() {
    this.#vx *= -1;
  }

  update() {
    this.x += this.#vx;
    this.y += this.#vy;
  }
}
