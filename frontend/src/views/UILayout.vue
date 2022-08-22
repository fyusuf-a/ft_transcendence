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

export default defineComponent({
  name: 'Home',
  components: {
    TheAppBar,
    TheNavigationDrawer,
  },
  data: () => ({
    navigationDrawerVisible: true,
    authentificated: true,
    viewedComponent: 'profile',
  }),
});
</script>
