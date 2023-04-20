<template>
  <v-card
    color="primary"
    elevation="0"
    class="d-flex flex-row justify-center align-center"
  >
    <v-avatar variant="plain-opacity" size="54" :image="avatar"> </v-avatar>
    <v-card-title class="text-subtitle-1"> {{ username }}</v-card-title>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  computed: {
    ...mapGetters(['username', 'avatar']),
  },
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
  created() {
    if (this.avatar !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>

<style scoped>
:hover {
  color: #fff;
}
</style>
