<template>
  <v-card class="mr-10" max-width="1000">
    <v-card-title class="white--text orange darken-4" align="center">
      Statistics
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="text-h6">
      <div class="mb-2">Matches played: {{ matchPlayed }}</div>
      <div class="mb-2">Wins: {{ wins}} </div>
      <div class="">Winrate: {{ winrate }}%</div>
    </v-card-text>
    <v-col>
      <my-level />
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
  winrate: 0,
  wins: 0,
  losses: 0,
  matchPlayed: 0,
}),
methods: {
  ...mapGetters(['id']),
},
async created() {
  const response = await axios.get('/users/' + this.id());
  
  this.wins = response.data.wins;
  this.losses = response.data.losses;
  this.matchPlayed = this.wins + this.losses;
  this.winrate = Math.trunc((this.wins / (this.wins + this.losses)) * 100);
  if (isNaN(this.winrate)) {
    this.winrate = 0;
  }
},
});
</script>
