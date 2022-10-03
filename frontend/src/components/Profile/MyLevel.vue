<template>
  <v-card class="ma-5" max-width="1000">
    <v-card-title class="" align="center">
      Rating
    </v-card-title>
    <v-card>
      <v-progress-linear
        v-model="rating"
        color="success"
        height="25"
      >
        <template v-slot:default="{ value }">
          <strong>{{ Math.ceil(value) }}%</strong>
        </template>
      </v-progress-linear>
      <br>
    </v-card>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
export default defineComponent({
  data: () => ({
    rating: 0,
    idOther: 0,
    matchPlayed: 0,
  }),
  methods: {
    ...mapGetters(['id']),
    async assingStats(id: number) {
      const response = await axios.get('/users/' + id);
      response.data.losses;
      this.matchPlayed = response.data.wins +  response.data.losses;
      this.rating = response.data.rating;
    },
  },
  props: ['user'],
  async created() {
    if (this.user) {
      let response = await axios.get(`/users/name/${this.user}`);
      this.assingStats(response.data.id);
    }
    else {
      this.assingStats(this.id());
    }
  },
});
</script>
