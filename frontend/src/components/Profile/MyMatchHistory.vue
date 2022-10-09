<template>
  <v-card class="pa-2 ml-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4" align="center">
      The last 10 games {{ username }} played
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row v-for="tabMatch in tabMatchs.slice(-10) " :key="tabMatch.matchId" >
        <p class="versus">Match #{{ tabMatch.matchNum }} - {{ tabMatch.usernameOne }} versus {{ tabMatch.usernameTwo}} winner: </p><p class="winner">{{ tabMatch.usernameOne }} 🌟</p>   
      </v-row>
    </v-card-text>
    <br />
    <div align="center">
      <v-btn>
        See all games played by {{ username }}
        <v-dialog
          model="dialog"
          activator="parent"
        >
          <v-card class="v-dialog-pos">
            <v-card-text>
              <v-row v-for="tabMatch in tabMatchs" :key="tabMatch.matchId" >
                <p class="versus">Match #{{ tabMatch.matchNum }} - {{ tabMatch.usernameOne }} versus {{ tabMatch.usernameTwo}} winner: </p><p class="winner">{{ tabMatch.usernameOne }} 🌟</p>   
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

interface Match {
  idOther: number,
  tabMatchs: { status: string, homeId: number, awayId: number, matchId: number, usernameOne: string, usernameTwo: string, matchNum: number, } [],
  idMatch: number,
  dialog: boolean,
  username: string,
}

export default defineComponent({
  data(): Match {
    return {
      idOther: 0,
      tabMatchs: [],
      idMatch: 0,
      dialog: false,
      username: '',
    };
  },
  methods: {
    ...mapGetters(['id']),
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
          usernameOne: '',
          usernameTwo: '',
          matchNum: 0,
        });
      }
      for (let i: number = 0 ; i < this.tabMatchs.length ; i++) {
        this.tabMatchs[i].matchNum = i + 1;

        if (this.tabMatchs[i].status === "HOME") {
          if (id == this.tabMatchs[i].homeId) {
            // win
            let response = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameOne = response.data.username
            let response2 = await axios.get('/users/' + this.tabMatchs[i].awayId)
            this.tabMatchs[i].usernameTwo = response2.data.username
          }
          else {
            //lose
            let response = await axios.get('/users/' + this.tabMatchs[i].homeId)
            this.tabMatchs[i].usernameOne = response.data.username
            let response2 = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameTwo = response2.data.username
          }
        }
        else if (this.tabMatchs[i].status === "AWAY") {
          if (id == this.tabMatchs[i].homeId) {
            //lose
            let response = await axios.get('/users/' + this.tabMatchs[i].awayId)
            this.tabMatchs[i].usernameOne = response.data.username
            let response2 = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameTwo = response2.data.username
          }
          else {
            //win
            let response = await axios.get('/users/' + id)
            this.tabMatchs[i].usernameOne = response.data.username
            let response2 = await axios.get('/users/' + this.tabMatchs[i].homeId)
            this.tabMatchs[i].usernameTwo = response2.data.username
          }
        }
      }
    }
  },
  props: ['user'],
  async created() {
    if (this.user) {
      let response = await axios.get(`/users/name/${this.user}`);
      this.setWinner(response.data.id);
      this.username = this.user;
    }
    else {
      this.setWinner(this.id());
      let response = await axios.get('/users/me');
      this.username = response.data.username;
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
