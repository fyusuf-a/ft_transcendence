<template>
  <div>
    <the-app-bar v-model="navigationDrawerVisible" />
    <the-navigation-drawer v-model="navigationDrawerVisible" temporary/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheNavigationDrawer from '../components/UI/TheNavigationDrawer.vue';
import TheAppBar from '../components/UI/TheAppBar.vue';
import { io } from 'socket.io-client';

export default defineComponent({
  name: 'Home',
  components: {
    TheAppBar,
    TheNavigationDrawer,
  },
  data: () => ({
    socket: io(
        `http://${import.meta.env.VITE_BACKEND_HOST}:${
          import.meta.env.VITE_BACKEND_PORT
        }/notifications`,
      ),
    navigationDrawerVisible: true,
    authentificated: true,
    viewedComponent: 'profile',
  }),
  methods: {
    async created() {
    this.$store.getters.socket().emit('connect', {
      id: this.$store.getters.id,
      token: this.$store.getters.token,
    });
  }
}
});
</script>
