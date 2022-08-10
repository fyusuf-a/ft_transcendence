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
        `http://${import.meta.env.VITE_BACKEND_HOST}:${
          import.meta.env.VITE_BACKEND_PORT
        }/chat`,
      ),
    };
  },
  components: {
    'game-window': GameWindowVue,
  },
  methods: {},
  computed: {},
});
</script>
