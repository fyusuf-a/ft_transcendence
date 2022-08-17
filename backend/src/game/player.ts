const PADDLE_SPEED = 7.5;

export class Player {
  x: number; // x position
  y: number; // y position
  dy: number; // y velocity
  width: number; // (probably constant, but maybe changed by options or powerups)
  height: number; // (probably constant, but maybe changed by options or powerups)
  direction: number;

  constructor(x = 0, y = 0, width = 10, height = 100) {
    this.x = x;
    this.y = y;
    this.dy = PADDLE_SPEED;
    this.direction = 0;
    this.width = width;
    this.height = height;
  }

  move(dy: number) {
    if (dy < 0) this.direction = -1;
    else if (dy > 0) this.direction = 1;
    else this.direction = 0;
  }

  get_x() {
    return this.x;
  }
  get_y() {
    return this.y;
  }
  get_width() {
    return this.width;
  }
  get_height() {
    return this.height;
  }

  update() {
    this.y += this.dy * this.direction;
    if (this.get_y() < 0.0) this.y = 0.0;
    else if (this.get_y() > 380.0) this.y = 380.0;
  }
}
