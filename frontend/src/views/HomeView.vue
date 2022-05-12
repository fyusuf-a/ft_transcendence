<template>
  <div>
    <the-app-bar v-if="connected"
                       @toggle-navigation-drawer="navigationDrawerVisible=!navigationDrawerVisible"/>
    <the-navigation-drawer v-if="connected" :visible="navigationDrawerVisible"/>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TheNavigationDrawer from "../components/UI/TheNavigationDrawer.vue";
import TheAppBar from "../components/UI/TheAppBar.vue";

export default Vue.extend({
  name: "Home",

  components: {
    "the-app-bar": TheAppBar,
    TheNavigationDrawer,
  },
  data: () => ({
    navigationDrawerVisible: true,
    connected: true,
  }),
});
</script>
