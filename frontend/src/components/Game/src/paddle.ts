import { isKeyPressed } from './input';

const SPEED = 7.5;

const paddle = new Image();
paddle.src = 'src/assets/images/game/paddle.png';

class Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  up: string;
  down: string;
  score: number;
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
    this.score = 0;
    this.up = key_up;
    this.down = key_down;
    this.img_data = ctx.getImageData(
      0,
      0,
      paddleCanvas?.width ? paddleCanvas.width : 0,
      paddleCanvas?.height ? paddleCanvas.height : 0,
    );
  }

  update() {
    if (isKeyPressed(this.up) && this.y > 0.0) this.y -= SPEED;
    if (isKeyPressed(this.down) && this.y < 380.0) this.y += SPEED;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.img_data, this.x, this.y);
  }
}

export { Paddle };
