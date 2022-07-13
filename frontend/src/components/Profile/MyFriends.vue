<template>
  <v-card :loading="loading" class="ma-5" max-width="400">
    <v-card-title class="white--text orange darken-4">
      Friends

      <v-spacer></v-spacer>

      <v-btn color="white" class="text--primary" fab small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <v-virtual-scroll :items="users" item-height="50" height="300" width="500">
      <template v-slot:default="{ item }">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>{{ item.username }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </v-card>
</template>

<script lang="ts">
import axios from "axios";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      loading: true,
      users: [],
    };
  },
  async created() {
    let response = await axios.get("/friendships/", {
      params: {
        sourceId: this.$store.getters.id,
        status: "accepted",
      },
    });
    response.data.data.forEach(async (friendship) => {
      let userResponse = await axios.get("/users/" + friendship.targetId);
      this.users.push({ username: userResponse.data.username });
    });
    this.loading = false;
  }),
});
</script>
