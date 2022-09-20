<template>
  <v-card class="pa-2 mr-15 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
      Achievements
    </v-card-title>
    <v-spacer></v-spacer>
    <v-card>
      achievements list
    </v-card>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  data: () => ({
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
      }
      else {
      }
      }
    else {
    }
  },
});
</script>
