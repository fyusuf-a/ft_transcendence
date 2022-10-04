<template>
  <v-card class="mr-10" max-width="1000">
    <v-card-title class="white--text orange darken-4" align="center">
      Statistics
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="text-h6">
      <div class="mb-2">Matches played: {{ matchPlayed }}</div>
      <div class="mb-2">Wins: {{ wins}} </div>
    </v-card-text>
    <v-col>
      <my-level :user="user" />
    </v-col>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import MyLevel from '@/components/Profile/MyLevel.vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  components: {
    'my-level': MyLevel,
  },
  data: () => ({
    wins: 0,
    losses: 0,
    matchPlayed: 0,
  }),
  methods: {
    ...mapGetters(['id']),
    async assingStats(id: number) {
      const response = await axios.get('/users/' + id);
      this.wins = response.data.wins;
      this.losses = response.data.losses;
      this.matchPlayed = this.wins + this.losses;
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
