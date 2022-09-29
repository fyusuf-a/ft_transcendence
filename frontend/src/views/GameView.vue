<template>
  <div>
      <img src="@/assets/images/king-pong.png" width="100" />
      <h1 align="center" id="game">Will you be the King of Pong?</h1>
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
        `http://${import.meta.env.VITE_BACKEND_HOST}:${
          import.meta.env.VITE_BACKEND_PORT
        }/game`,
      ),
    };
  },
  components: {
    'game-window': GameWindowVue,
  },
  methods: {
    handleConnection() {
      this.socket.emit('auth', {
        id: this.$store.getters.id,
        token: this.$store.getters.token,
      });
    },
  },
  created() {
    this.socket.on('game-connect', this.handleConnection);
  },
  beforeDestroy() {
    this.socket.off('game-connect');
  },
});
</script>

<style scoped>
#game {
  margin: 30px 0 0 100px;
}
img {
  border-radius: 50%;
  margin-left: 50%;
  margin-top: 30px;
}
</style>
