import { Grid } from './grid';

export enum Direction {
  ToTheLeft,
  ToTheRight,
}

export class Player {
  #x: number; // x position
  #y: number; // y position
  #vy: number; // y velocity
  #width: number; // (probably constant, but maybe changed by options or powerups)
  #height: number; // (probably constant, but maybe changed by options or powerups)
  #grid: Grid;
  #orientation: Direction;
  #direction: number;

  constructor(
    x = 0,
    y = 0,
    width = 10,
    height = 100,
    grid = new Grid(),
    orientation = Direction.ToTheRight,
    speed = 0,
  ) {
    this.#x = x;
    this.#y = y;
    this.#vy = Math.abs(speed);
    this.#direction = 0;
    this.#width = width;
    this.#grid = grid;
    this.#orientation = orientation;
    this.#height = height;
  }

  move(dy: number) {
    if (dy < 0) this.#direction = -1;
    else if (dy > 0) this.#direction = 1;
    else this.#direction = 0;
  }

  get x() {
    return this.#x;
  }
  get y() {
    return this.#y;
  }
  set y(y: number) {
    if (y < 0) this.#y = 0;
    else if (y > this.#grid.height - this.#height)
      this.#y = this.#grid.height - this.#height;
    else this.#y = y;
  }
  get width() {
    return this.#width;
  }
  get height() {
    return this.#height;
  }
  get edge() {
    return this.#orientation === Direction.ToTheRight
      ? this.#x + this.#width
      : this.#x;
  }
  get back() {
    return this.#orientation === Direction.ToTheRight
      ? this.#x
      : this.#x + this.#width;
  }
  update() {
    this.y += this.#vy * this.#direction;
  }

  get bottom() {
    return this.#y;
  }
  get top() {
    return this.#y + this.#height;
  }
}
