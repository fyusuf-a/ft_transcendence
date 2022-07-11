<template>
  <v-card :color="color" class="ma-y8" elevation="0">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="picture" alt="profile picture" />
      </v-list-item-avatar>
      <v-list-item-content>
        {{ username() }}
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data: function () {
    return {
      ...mapGetters(["username", "avatar", "id"]),
    };
  },
  computed: {
    picture() {
      if (this.$store.state.avatar === undefined) {
        return require("@/assets/images/king-pong.png");
      }
      return this.$store.state.avatar;
    },
  },
  props: {
    color: {
      type: String,
      default: "primary",
    },
  },
  created() {
    if (this.$store.state.avatar !== undefined) return;
    this.$store.dispatch("getAvatar");
  },
};
</script>

<style scoped>
:hover {
  color: #fff;
}
</style>
