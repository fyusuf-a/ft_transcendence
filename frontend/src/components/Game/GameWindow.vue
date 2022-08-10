<template>
  <div>
    <div>
      <v-btn @click="clear">Clear Screen</v-btn> {{ x }}, {{ y }}
      <v-btn @click="startGame">Start Game</v-btn>
    </div>
    <canvas
      ref="pong"
      id="pong"
      width="640"
      height="480"
      @mousemove="draw"
    ></canvas>
    <canvas
      id="background"
      width="640"
      height="480"
      style="visibility: hidden"
    ></canvas>
    <canvas
      id="paddle"
      width="10"
      height="100"
      style="visibility: hidden"
    ></canvas>
    <canvas
      id="ball"
      width="13"
      height="13"
      style="visibility: hidden"
    ></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Pong } from './src/pong';

interface DataReturnTypes {
  ctx: CanvasRenderingContext2D | null;
  x: number;
  y: number;
  pong: Pong | null;
  pongCanvas: HTMLCanvasElement | null;
  backgroundCanvas: HTMLCanvasElement | null;
  ballCanvas: HTMLCanvasElement | null;
  paddleCanvas: HTMLCanvasElement | null;
}

export default defineComponent({
  data: function (): DataReturnTypes {
    return {
      ctx: null,
      x: 0,
      y: 0,
      pong: null,
      pongCanvas: null,
      backgroundCanvas: null,
      ballCanvas: null,
      paddleCanvas: null,
    };
  },
  methods: {
    startGame() {
      if (!this.pong) {
        this.pong = new Pong(
          this.pongCanvas,
          this.ballCanvas,
          this.backgroundCanvas,
          this.paddleCanvas,
        );
      }
      this.pong.start();
    },
    clear() {
      const canvas = this.$refs.pong as HTMLCanvasElement;
      if (canvas) console.log('canvas loaded');
      console.log(canvas);
      const ctx: CanvasRenderingContext2D = canvas.getContext(
        '2d',
      ) as CanvasRenderingContext2D;
      if (ctx) console.log('context loaded');
      console.log(ctx);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 1500, 1000);
    },
    draw(e: MouseEvent) {
      this.drawLine(this.x, this.y, e.offsetX, e.offsetY);
      this.x = e.offsetX;
      this.y = e.offsetY;
    },
    drawLine(x1: number, y1: number, x2: number, y2: number) {
      let ctx = this.ctx;
      if (!ctx) return;
      ctx.beginPath();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1;
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      // ctx.closePath();
    },
  },
  mounted() {
    console.log('mounted');
    this.pongCanvas = document.getElementById('pong') as HTMLCanvasElement;
    this.backgroundCanvas = document.getElementById(
      'background',
    ) as HTMLCanvasElement;
    this.ballCanvas = document.getElementById('ball') as HTMLCanvasElement;
    this.paddleCanvas = document.getElementById('paddle') as HTMLCanvasElement;
    this.ctx = this.pongCanvas.getContext('2d') as CanvasRenderingContext2D;
  },
});
</script>

<style scoped>
#pong {
  border: solid black 1px;
  width: 640px;
  height: 480px;
  margin-left: 10px;
}

#ball {
  border: solid black 1px;
  width: 640px;
  height: 480px;
  margin-left: 10px;
}

#paddle {
  border: solid black 1px;
  width: 640px;
  height: 480px;
  margin-left: 10px;
}

#background {
  border: solid black 1px;
  width: 640px;
  height: 480px;
  margin-left: 10px;
}
</style>
