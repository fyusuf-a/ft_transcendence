const backgroundLight = new Image();
backgroundLight.src =
  'src/assets/images/game/light-mode/background-black-hole.png';

class BackgroundBH {
  img_data: ImageData;

  constructor(backgroundLightCanvas: HTMLCanvasElement | null) {
    const canvas = backgroundLightCanvas;
    const ctx: CanvasRenderingContext2D = canvas?.getContext(
      '2d',
    ) as CanvasRenderingContext2D;
    ctx.drawImage(backgroundLight, 0, 0);
    this.img_data = ctx.getImageData(
      0,
      0,
      backgroundLightCanvas?.width ? backgroundLightCanvas.width : 0,
      backgroundLightCanvas?.height ? backgroundLightCanvas.height : 0,
    );
  }
  render(ctx: CanvasRenderingContext2D) {
    ctx.putImageData(this.img_data, 0, 0);
  }
}

export { BackgroundBH };
