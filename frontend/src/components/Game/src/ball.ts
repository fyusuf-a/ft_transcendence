const SPEED = 3.5;

const ball = new Image();
ball.src = 'src/assets/images/ball.png';

function random(min: number, max: number) {
  return min + Math.random() * (max - min);
}

class Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  img_data: ImageData;

  constructor(ballCanvas: HTMLCanvasElement | null) {
    const ctx = ballCanvas?.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(ball, 0, 0);
    this.size = 13;
    this.x = random(150, 390);
    this.y = random(100, 380);
    this.dx = this.x < 320 ? SPEED : -SPEED;
    this.dy = random(-SPEED, SPEED);
    this.img_data = ctx.getImageData(
      0,
      0,
      ballCanvas?.width ? ballCanvas.width : 0,
      ballCanvas?.height ? ballCanvas.height : 0,
    );
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

  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.img_data, this.x, this.y);
  }
}

export { Ball };
