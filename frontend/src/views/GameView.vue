<template>
  <div>
      <img src="@/assets/images/king-pong.jpg" width="110" />
      <h1 align="center" class="game">Will you be the King of Pong?</h1>
      <h3 align="center" class="game">How to play:</h3>
      <p align="center" class="game">
        Click on <b>Join Queue</b> to reach a game. Then, click on the game and use ↕ arrows on your keyborad.<br />
        You can also choose to change the map, by clicking "De/Active BlackHole map". The first player to reach eleven (11) points wins.<br />You can watch a game. Choose which in the list
        and click on Spectacte.
      </p>
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
  beforeRouteLeave() {
    this.socket.disconnect();
  },
  beforeRouteEnter() {

  },
  beforeDestroy() {
    this.socket.off('game-connect');
  },
});
</script>

<style scoped>
.game {
  margin: 30px 0 0 100px;
}
img {
  border-radius: 50%;
  margin-left: 50%;
  margin-top: 30px;
}
</style>
