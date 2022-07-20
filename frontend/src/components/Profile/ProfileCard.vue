<template>
  <v-card :color="color" class="ma-y8" elevation="0">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="avatar()" alt="profile picture" />
      </v-list-item-avatar>
      <v-list-item-content>
        {{ username() }}
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data: function () {
    return {
      ...mapGetters(['username', 'avatar']),
    };
  },
  props: {
    color: {
      type: String,
      default: 'primary',
    },
  },
  created() {
    if (this.avatar() !== undefined) return;
    this.$store.dispatch('getAvatar');
  },
});
</script>

<style scoped>
:hover {
  color: #fff;
}
</style>
