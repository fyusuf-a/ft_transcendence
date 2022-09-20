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
  }),
  methods: {
    ...mapGetters(['id']),
  },
  props: ['user'],
  async created() {
    if (this.user) {
      let response = await axios.get('/users/');
      for (let i: number = 0; i < response.data.data.length; i++) {
        if (this.user === response.data.data[i].username) {
          this.idOther = response.data.data[i].id
        }
      };
      if (this.idOther == this.id()) {
        let response2 = await axios.get('/users/' + this.id());
        this.rating = response2.data.rating;
      }
      else {
        let response2 = await axios.get('/users/' + this.idOther);
        this.rating = response2.data.rating;
      }
    }
    else {
      let response = await axios.get('/users/' + this.id());
      this.rating = response.data.rating;
    }
  },
});
</script>
