<template>
    <v-card class="pa-2 ml-15 mt-5" width="40%">
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
  
  methods: {
    ...mapGetters(['username', 'avatar', 'id']),
  },

async created() {
//          const response2 = await axios.get('http://localhost:8080/users/' + this.id());
// console.log(response2.data);
// // console.log(response2.data.username);
const response1 = await axios.get('http://localhost:8080/achievements/1');
console.log(response1.data);
},
});
</script>