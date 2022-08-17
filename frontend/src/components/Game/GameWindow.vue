<template>
  <div>
    <div>
      <v-btn @click="createGame">Create Server-side Game</v-btn>
      <v-btn @click="joinGame">Join Server-side Game</v-btn>
      <v-btn @click="spectateServerGame">Spectate Server-side Game</v-btn>
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
import { CreateGameDto } from '@dtos/game/create-game.dto'

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
    createGame() {
      const createGame: CreateGameDto = { gameId: 2, room: '2' };
      this.socket.emit('game-create', createGame);
      this.spectateServerGame();
    },
    joinGame() {
      this.socket.emit('game-join', 2);
      this.spectateServerGame();
    },
    spectateServerGame() {
      if (!this.pong) {
        this.pong = new Pong(
          this.pongCanvas,
          this.ballCanvas,
          this.backgroundCanvas,
          this.paddleCanvas,
          this.socket as Socket,
        );
      }
      this.pong.spectate(2);
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

    window.addEventListener("keydown", (event) => {
      console.log("key down detected!!");
      console.log("key: " + event.code);
      if (!this.pong) return;
      if (event.code === "ArrowUp") {
        this.socket.emit('game-move', { gameId: 2, dy: -1 });
      } else if (event.code === "ArrowDown") {
        this.socket.emit('game-move', { gameId: 2, dy: 1 });
      }
    });

    window.addEventListener("keyup", (event) => {
      console.log("key up detected!!");
      console.log("key: " + event.code);
      if (!this.pong) return;
      if (event.code === "ArrowUp") {
        this.socket.emit('game-move', { gameId: 2, dy: 0 });
      } else if (event.code === "ArrowDown") {
        this.socket.emit('game-move', { gameId: 2, dy: 0 });
      }
    });
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
