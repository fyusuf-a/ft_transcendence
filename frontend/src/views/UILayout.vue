<template>
  <div>
    <the-app-bar v-model:modelValue="navigationDrawerVisible" v-model:displayNotifications="notificationsVisible" />
    <the-navigation-drawer v-model:modelValue="navigationDrawerVisible" temporary/>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TheNavigationDrawer from '../components/UI/TheNavigationDrawer.vue';
import TheAppBar from '../components/UI/TheAppBar.vue';

export default defineComponent({
  name: 'Home',
  components: {
    TheAppBar,
    TheNavigationDrawer,
},
  data: () => ({
    navigationDrawerVisible: true,
    notificationsVisible: false,
    authentificated: true,
    viewedComponent: 'profile',
  }),
    beforeCreate() {
      this.$store.commit('setSocket');
  }
});
</script>
