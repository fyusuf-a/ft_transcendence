<template>
  <div>
    <div>
      <v-btn @click="startGame">Start Game</v-btn>
      <v-btn @click="spectateGame">Spectate Game</v-btn>
    </div>
    <canvas ref="pong" id="pong" width="640" height="480"></canvas>
    <canvas id="background" width="640" height="480" style="visibility: hidden"></canvas>
    <canvas id="paddle" width="10" height="100" style="visibility: hidden"></canvas>
    <canvas id="ball" width="13" height="13" style="visibility: hidden"></canvas>
  </div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
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
  props: {
    socket: {
      type: Object,
      required: true,
    },
  },
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
          this.socket as Socket,
        );
      }
      this.pong.start(-1);
    },
    spectateGame() {
      if (!this.pong) {
        this.pong = new Pong(
          this.pongCanvas,
          this.ballCanvas,
          this.backgroundCanvas,
          this.paddleCanvas,
          this.socket as Socket,
        );
      }
      this.pong.spectate();
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
