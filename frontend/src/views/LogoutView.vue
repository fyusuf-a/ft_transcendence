<template>
  <v-container>
    <div>Logging out...</div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  async mounted() {
    await this.$store.commit('logout');
    this.$router.push('/');
  },
});
</script>
