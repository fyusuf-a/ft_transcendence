<template>
  <v-card class="pa-2 mr-15 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
      Achievements
    </v-card-title>
    <v-divider></v-divider>
    <v-row>
      <div v-for="tabAch in tabAchs" :key="tabAch.id">
        <img v-if="tabAch.img" :src="tabAch.img"/>
      </div>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import imageAch1 from '@/assets/achievements/default.png'
import imageAch2 from '@/assets/achievements/car.png'

interface Achievements {
  idOther: number,
  tabAchs: { id: number, img: string } [],
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
          this.tabAchs[i].img = imageAch1;
        }
        if (this.tabAchs[i].id == 4) {
          this.tabAchs[i].img = imageAch2;
        }
        if (this.tabAchs[i].id == 5) {
          this.tabAchs[i].img = imageAch1;
        }
        if (this.tabAchs[i].id == 6) {
          this.tabAchs[i].img = imageAch2;
        }
        if (this.tabAchs[i].id == 7) {
          this.tabAchs[i].img = imageAch1;
        }

      }
    },
    async getAchievements(id: number) {
      const response = await axios.get('/users/' + id + '/achievements/');
      for (let i: number = 0 ; i < response.data.length ; i++)
      {
        this.tabAchs.push({
          id: response.data[i].achievementId,
          img: '',
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
  /* max-height: 70px; */
  margin: 20px;
  margin-top: 40px;
  /* width: 50%; */
  /* max-width: 50px; */
}
</style>
