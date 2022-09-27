const score0 = new Image();
score0.src = 'src/assets/images/zero.png';
const score1 = new Image();
score1.src = 'src/assets/images/one.png';
const score2 = new Image();
score2.src = 'src/assets/images/two.png';
const score3 = new Image();
score3.src = 'src/assets/images/three.png';
const score4 = new Image();
score4.src = 'src/assets/images/four.png';
const score5 = new Image();
score5.src = 'src/assets/images/five.png';
const score6 = new Image();
score6.src = 'src/assets/images/six.png';
const score7 = new Image();
score7.src = 'src/assets/images/seven.png';
const score8 = new Image();
score8.src = 'src/assets/images/eight.png';
const score9 = new Image();
score9.src = 'src/assets/images/nine.png';

class Score {
    score_1: number;
    score_2: number;
    img_data0: ImageData;
    img_data1: ImageData;
    img_data2: ImageData;
    img_data3: ImageData;
    img_data4: ImageData;
    img_data5: ImageData;
    img_data6: ImageData;
    img_data7: ImageData;
    img_data8: ImageData;
    img_data9: ImageData;

  constructor(
    sc_1: number, 
    sc_2: number,
    scoreCanvas: HTMLCanvasElement | null,
  ) {
    const canvas0 = scoreCanvas;
    const ctx0 = canvas0?.getContext('2d') as CanvasRenderingContext2D;
    ctx0?.drawImage(score0, 0, 0);
    this.img_data0 = ctx0?.getImageData(0, 0, 70, 70);

    const canvas1 = scoreCanvas;
    const ctx1 = canvas1?.getContext('2d') as CanvasRenderingContext2D;
    ctx1?.drawImage(score1, 0, 0);
    this.img_data1 = ctx1?.getImageData(0, 0, 70, 70);
    
    const canvas2 = scoreCanvas;
    const ctx2 = canvas2?.getContext('2d') as CanvasRenderingContext2D;
    ctx2?.drawImage(score2, 0, 0);
    this.img_data2 = ctx2?.getImageData(0, 0, 70, 70);
    
    const canvas3 = scoreCanvas;
    const ctx3 = canvas3?.getContext('2d') as CanvasRenderingContext2D;
    ctx3?.drawImage(score3, 0, 0);
    this.img_data3 = ctx3?.getImageData(0, 0, 70, 70);
    
    const canvas4 = scoreCanvas;
    const ctx4 = canvas4?.getContext('2d') as CanvasRenderingContext2D;
    ctx4?.drawImage(score4, 0, 0);
    this.img_data4 = ctx4?.getImageData(0, 0, 70, 70);
    
    const canvas5 = scoreCanvas;
    const ctx5 = canvas5?.getContext('2d') as CanvasRenderingContext2D;
    ctx5?.drawImage(score5, 0, 0);
    this.img_data5 = ctx5?.getImageData(0, 0, 70, 70);
    
    const canvas6 = scoreCanvas;
    const ctx6 = canvas6?.getContext('2d') as CanvasRenderingContext2D;
    ctx6?.drawImage(score6, 0, 0);
    this.img_data6 = ctx6?.getImageData(0, 0, 70, 70);
    
    const canvas7 = scoreCanvas;
    const ctx7 = canvas7?.getContext('2d') as CanvasRenderingContext2D;
    ctx7?.drawImage(score7, 0, 0);
    this.img_data7 = ctx7?.getImageData(0, 0, 70, 70);
    
    const canvas8 = scoreCanvas;
    const ctx8 = canvas8?.getContext('2d') as CanvasRenderingContext2D;
    ctx8?.drawImage(score8, 0, 0);
    this.img_data8 = ctx8?.getImageData(0, 0, 70, 70);
    
    const canvas9 = scoreCanvas;
    const ctx9 = canvas9?.getContext('2d') as CanvasRenderingContext2D;
    ctx9?.drawImage(score9, 0, 0);
    this.img_data9 = ctx9?.getImageData(0, 0, 70, 70);
    

    this.score_1 = sc_1;
    this.score_2 = sc_2;

  }

  update(sc_1: number, sc_2: number) {
    this.score_1 = sc_1;
    this.score_2 = sc_2;
  }

  render(ctx: CanvasRenderingContext2D) {
    if (this.score_1 === 0) {
      ctx.putImageData(this.img_data0, 130, 0);
    } 
    else if (this.score_1 === 1) {
      ctx.putImageData(this.img_data1, 130, 0);
    }
    else if (this.score_1 === 2) {
      ctx.putImageData(this.img_data2, 130, 0);
    }
    else if (this.score_1 === 3) {
      ctx.putImageData(this.img_data3, 130, 0);
    }
    else if (this.score_1 === 4) {
      ctx.putImageData(this.img_data4, 130, 0);
    }
    else if (this.score_1 === 5) {
      ctx.putImageData(this.img_data5, 130, 0);
    }
    else if (this.score_1 === 6) {
      ctx.putImageData(this.img_data6, 130, 0);
    }
    else if (this.score_1 === 7) {
      ctx.putImageData(this.img_data7, 130, 0);
    }
    else if (this.score_1 === 8) {
      ctx.putImageData(this.img_data8, 130, 0);
    }
    else if (this.score_1 === 9) {
      ctx.putImageData(this.img_data9, 130, 0);
    }

    if (this.score_2 === 0) {
      ctx.putImageData(this.img_data0, 450, 0);
    } 
    else if (this.score_2 === 1) {
      ctx.putImageData(this.img_data1, 450, 0);
    }
    else if (this.score_2 === 2) {
      ctx.putImageData(this.img_data2, 450, 0);
    }
    else if (this.score_2 === 3) {
      ctx.putImageData(this.img_data3, 450, 0);
    }
    else if (this.score_2 === 4) {
      ctx.putImageData(this.img_data4, 450, 0);
    }
    else if (this.score_2 === 5) {
      ctx.putImageData(this.img_data5, 450, 0);
    }
    else if (this.score_2 === 6) {
      ctx.putImageData(this.img_data6, 450, 0);
    }
    else if (this.score_2 === 7) {
      ctx.putImageData(this.img_data7, 450, 0);
    }
    else if (this.score_2 === 8) {
      ctx.putImageData(this.img_data8, 450, 0);
    }
    else if (this.score_2 === 9) {
      ctx.putImageData(this.img_data9, 450, 0);
    }
  }
}

export { Score };
