const background = new Image();
background.src = 'src/assets/images/background.png';

class Background {
  img_data: ImageData;

  constructor() {
    const canvas = document.getElementById('background') as HTMLCanvasElement;
    const ctx: CanvasRenderingContext2D = canvas.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    ctx.drawImage(background, 0, 0);
    this.img_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.img_data, 0, 0);
  }
}

export { Background };
