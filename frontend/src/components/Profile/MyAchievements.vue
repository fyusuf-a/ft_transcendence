<template>
  <v-card class="pa-2 mr-15 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
      Achievements
    </v-card-title>
    <v-divider></v-divider>
    <v-row>
      <div v-for="tabAch in tabAchs" :key="tabAch.id">
        <v-col><img v-if="tabAch.img" :src="tabAch.img" :title="tabAch.description" /></v-col>
        <v-col><p class="achievementsName">{{ tabAch.name }}</p></v-col>
      </div>
      <p class="pt-10 achievementsName" v-if="!tabAchs.length" >
        No achievement obtained yet.
      </p>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import imageAch1 from '@/assets/achievements/ping.png';
import imageAch2 from '@/assets/achievements/pong.png';
import imageAch3 from '@/assets/achievements/addict.png';
import imageAch4 from '@/assets/achievements/beginnersLuck.png';
import imageAch5 from '@/assets/achievements/playerDiff.png';
import imageAch6 from '@/assets/achievements/mastery.png';
import imageAch7 from '@/assets/achievements/king-pong.png';

interface Achievements {
  idOther: number,
  tabAchs: { id: number, img: string, name: string, description: string } [],
}

export default defineComponent({
  data(): Achievements {
    return {
      idOther: 0,
      tabAchs: [],
    };
  },
  methods: {
    ...mapGetters(['id']),
    setAchievementImg() {
      for (let i: number = 0 ; i < this.tabAchs.length ; i++) {
        if (this.tabAchs[i].id == 1) {
          this.tabAchs[i].img = imageAch1;
        }
        if (this.tabAchs[i].id == 2) {
          this.tabAchs[i].img = imageAch2;
        }
        if (this.tabAchs[i].id == 3) {
          this.tabAchs[i].img = imageAch3;
        }
        if (this.tabAchs[i].id == 4) {
          this.tabAchs[i].img = imageAch4;
        }
        if (this.tabAchs[i].id == 5) {
          this.tabAchs[i].img = imageAch5;
        }
        if (this.tabAchs[i].id == 6) {
          this.tabAchs[i].img = imageAch6;
        }
        if (this.tabAchs[i].id == 7) {
          this.tabAchs[i].img = imageAch7;
        }
      }
    },
    async getAchievements(id: number) {
      const response = await axios.get('/users/' + id + '/achievements/');
      for (let i: number = 0 ; i < response.data.length ; i++)
      {
        const response2 = await axios.get('/achievements/' + response.data[i].achievementId);
        this.tabAchs.push({
          id: response.data[i].achievementId,
          img: '',
          description: response2.data.description,
          name: response2.data.name,
        });
        this.setAchievementImg();
      }
    }
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
        this.getAchievements(this.id());
      }
      else {
        this.getAchievements(this.idOther);
      }
    }
    else {
      this.getAchievements(this.id());
    }
  },
});
</script>

<style scoped>
img {
  max-width: 70px;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 0px;
  margin-top: 40px;
}
.achievementsName {
  margin-right: 20px;
  margin-left: 25px;
  font-weight: bold;
  color: #951197;
  margin-bottom: 40px;
}
</style>
