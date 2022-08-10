export class Player {
  x: number; // x position
  y: number; // y position
  vy: number; // y velocity
  width: number; // (probably constant, but maybe changed by options or powerups)
  height: number; // (probably constant, but maybe changed by options or powerups)

  constructor(x = 0, y = 0, width = 10, height = 50) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.width = width;
    this.height = height;
  }

  move(dy: number) {
    this.y += dy;
  }
}
