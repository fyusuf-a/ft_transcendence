import { isKeyPressed } from './input';

const SPEED = 7.5;

const paddle = new Image();
paddle.src = 'src/assets/images/paddle.png';

class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  up: string;
  down: string;
  img_data: ImageData;

  constructor(
    x: number,
    y: number,
    key_up: string,
    key_down: string,
    paddleCanvas: HTMLCanvasElement | null,
  ) {
    const canvas = paddleCanvas;
    const ctx = canvas?.getContext('2d') as CanvasRenderingContext2D;
    ctx?.drawImage(paddle, 0, 0);
    this.x = x;
    this.y = y;
    this.width = 10;
    this.height = 100;
    this.up = key_up;
    this.down = key_down;
    this.img_data = ctx.getImageData(
      0,
      0,
      paddleCanvas?.width ? paddleCanvas.width : 0,
      paddleCanvas?.height ? paddleCanvas.height : 0,
    );
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
    if (isKeyPressed(this.up) && this.get_y() > 0.0) this.y -= SPEED;
    if (isKeyPressed(this.down) && this.get_y() < 380.0) this.y += SPEED;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.img_data, this.x, this.y);
  }
}

export { Paddle };
