<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',

  data() {
    return {
      //
    };
  },
});
</script>

<style>
.v-dialog-pos {
  display: block;
  margin-left: auto;
  margin-right: auto
}
</style>
