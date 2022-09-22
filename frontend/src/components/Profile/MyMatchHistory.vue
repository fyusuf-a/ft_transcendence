<template>
  <v-card class="pa-2 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
       Last 10 matches played
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row v-for="tabMatch in sortedArray().slice(0, 10) " :key="tabMatch.matchId" >
        <p class="versus">Match #{{ tabMatch.matchId }} - {{ tabMatch.usernameOne }} versus {{ tabMatch.usernameTwo}} winner: </p><p class="winner">{{ tabMatch.usernameOne }} 🌟</p>   
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

interface Match {
  idOther: number,
  tabMatchs: { status: string, homeId: number, awayId: number, matchId: number, isAWin: boolean, usernameOne: string, usernameTwo: string} [],
  idMatch: number,
}

export default defineComponent({
  data(): Match {
    return {
      idOther: 0,
      tabMatchs: [],
      idMatch: 0,
    };
  },
  methods: {
    ...mapGetters(['id']),
    sortedArray() {
      return this.tabMatchs.sort((a: { matchId: number; }, b: { matchId: number; }) => b.matchId - a.matchId);
    },
    async setWinner(id: number) {
      let response = await axios.get('/users/' + id + '/matches');
      for (let i: number = 0 ; i < response.data.length ; i++) {
        this.idMatch = response.data[i].id;
        let response2 = await axios.get('/matches/' + this.idMatch)
        this.tabMatchs.push({
          status: response2.data.status,
          homeId: response2.data.homeId,
          awayId: response2.data.awayId,
          matchId: response2.data.id,
          isAWin: false,
          usernameOne: '',
          usernameTwo: '',
        });
        console.log(this.tabMatchs[i].matchId)
      }

      console.log()

      for (let i: number = 0 ; i < this.tabMatchs.length ; i++) {
        console.log(this.tabMatchs[i].matchId)
        console.log(i)

        if (this.tabMatchs[i].status === "HOME") {
          if (id == this.tabMatchs[i].homeId) {
            // win
            let response = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameOne = response.data.username
            console.log("userone: " + this.tabMatchs[i].usernameOne)
            let response2 = await axios.get('/users/' + this.tabMatchs[i].awayId)
            this.tabMatchs[i].usernameTwo = response2.data.username
            console.log("usertwo: " + this.tabMatchs[i].usernameTwo)
          }
          else {
            //lose
            let response = await axios.get('/users/' + this.tabMatchs[i].homeId)
            this.tabMatchs[i].usernameOne = response.data.username
            console.log("userone: " + this.tabMatchs[i].usernameOne)
            let response2 = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameTwo = response2.data.username
            console.log("usertwo: " + this.tabMatchs[i].usernameTwo)

          }
        }
        if (this.tabMatchs[i].status === "AWAY") {
          if (id == this.tabMatchs[i].homeId) {
            //lose
            let response = await axios.get('/users/' + this.tabMatchs[i].awayId)
            this.tabMatchs[i].usernameOne = response.data.username
            console.log("userone: " + this.tabMatchs[i].usernameOne)
            let response2 = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameTwo = response2.data.username
            console.log("usertwo: " + this.tabMatchs[i].usernameTwo)
          }
          else {
            //win
            let response = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameOne = response.data.username
            console.log("userone: " + this.tabMatchs[i].usernameOne)
            let response2 = await axios.get('/users/' + this.tabMatchs[i].homeId)
            this.tabMatchs[i].usernameTwo = response2.data.username
            console.log("usertwo: " + this.tabMatchs[i].usernameTwo)
            console.log()
          }
        }
        console.log()
      }
      
    }
  },
  props: ['user'],
  async created() {

    // change the roooooute
    if (this.user) {
      console.log("change de route");
    }
    // change the roooooute
    else {
      this.setWinner(this.id());
    }
  },
});
</script>

<style scoped>
.versus {
  margin-top: 20px;
}
.winner{
  font-weight: bold;
  margin-left: 2px;
  font-weight: bold;
  color: #951197;
  margin-top: 20px;
}
</style>
