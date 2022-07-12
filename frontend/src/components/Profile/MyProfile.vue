<template>
  <v-card class="pa-2 ma-5">
    <v-card
      class="ma-4"
      height="250"
      width="250"
      :img="this.$store.getters.avatar"
    />

    <v-card-title>{{ this.$store.getters.username }}</v-card-title>

    <v-card-actions>
      <v-btn color="deep-purple lighten-2" text @click="reserve">
        Change picture
      </v-btn>
      <v-btn color="deep-purple lighten-2" text @click="reserve">
        Change username
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  methods: {
    reserve() {
      // TODO: remove and replace with 2 methods: one to change the username, one to change the picture
    },
  },
};
</script>
