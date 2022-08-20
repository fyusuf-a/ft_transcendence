export class Player {
  x: number; // x position
  y: number; // y position
  dy: number; // y velocity
  width: number; // (probably constant, but maybe changed by options or powerups)
  height: number; // (probably constant, but maybe changed by options or powerups)
  direction: number;

  constructor(x = 0, y = 0, width = 10, height = 100, speed = 0) {
    this.x = x;
    this.y = y;
    this.dy = speed;
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
  }
}
