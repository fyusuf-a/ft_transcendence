<template>
  <div>
    <h1>Game</h1>
    <game-window :socket="socket"></game-window>
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
        }/game`,
      ),
    }
  },
  components: {
    'game-window': GameWindowVue,
  },
  methods: {
    handleConnection(payload: any) {
      console.log(payload);
      this.socket.emit('game-auth', {
        authorization: this.$store.getters.token,
      });
    },
    handleGameState(payload: any) {
      console.log(`Ball: (${payload.ball.x}, ${payload.ball.y}); Player0: ${payload.players[0].y}; Player1: ${payload.players[1].y}`);
    }
  },
  created() {
    this.socket.on('game-connect', this.handleConnection);
  },
  beforeDestroy() {
    this.socket.off('game-connect');
  },
});
</script>
