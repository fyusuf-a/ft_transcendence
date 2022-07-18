<template>
  <div>
    <div v-if="authentificated">
      <the-app-bar v-model="navigationDrawerVisible" />
      <the-navigation-drawer v-model="navigationDrawerVisible" />
      <router-view></router-view>
    </div>
    <component :is="login" v-else />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TheNavigationDrawer from '../components/UI/TheNavigationDrawer.vue';
import TheAppBar from '../components/UI/TheAppBar.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    'the-app-bar': TheAppBar,
    TheNavigationDrawer,
  },
  data: () => ({
    navigationDrawerVisible: true,
    authentificated: true,
    viewedComponent: 'profile',
  }),
});
</script>
