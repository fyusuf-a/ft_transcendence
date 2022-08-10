export class Ball {
  x: number; // x position
  y: number; // y position
  vx: number; // x velocity
  vy: number; // y velocity
  radius: number; // size of the ball (probably constant, but maybe changed by options or powerups)

  constructor(start_x = 320, start_y = 240) {
    this.x = start_x;
    this.y = start_y;
    this.vx = 1;
    this.vy = 0;
  }
}
