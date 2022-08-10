<template>
  <div>
    <h1>Game</h1>
    <game-window></game-window>
  </div>
</template>

<script lang="ts">
import GameWindowVue from '@/components/Game/GameWindow.vue';
import { defineComponent } from 'vue';
import { io, Socket } from 'socket.io-client';

interface DataReturnType {
  socket: Socket;
}

export default defineComponent({
  data(): DataReturnType {
    return {
      socket: io(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT
        }/chat`,
      ),
    }
  },
  components: {
    'game-window': GameWindowVue,
  },
  methods: {
    handleConnection(payload: any) {
      console.log(payload);
      this.socket.emit('game-create', { gameId: 1 }, (res: string) => {
        console.log(`Create Response: ${res}`);
        if (res.includes('game already exists')) {
          this.socket.emit('game-join', 1, (res: string) => {
            console.log(`Join Response: ${res}`);
            if (res.includes('Error')) {
              this.socket.emit('game-spectate', 1, (res: string) => {
                console.log(`Spectate Response: ${res}`);
              });
            }
          });
        }
      });
    },
    handleGameState(payload: any) {
      console.log(`Ball: (${payload.ball.x}, ${payload.ball.y}); Player0: ${payload.players[0].y}; Player1: ${payload.players[1].y}`);
    }
  },
  created() {
    this.socket.on('game-connect', this.handleConnection);
    this.socket.on('game-state', this.handleGameState);
  },
  beforeDestroy() {
    this.socket.off('game-connect');
    this.socket.off('game-connect', this.handleGameState);
  },
});
</script>
