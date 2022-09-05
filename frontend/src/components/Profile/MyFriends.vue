<template>
  <v-card :loading="loading" class="pa-2 ml-15 mr-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4">
      Friends
      <add-friend />

      <v-spacer></v-spacer>

    </v-card-title>

    <v-card-text>
      <li v-for="friend in friends" :key="friend.username">
        {{ friend.username }}
        <v-img :src="friend.avatar" ></v-img>
      </li>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AddFriend from './AddFriend.vue';


interface MyFriendsData {
  loading: boolean;
  friends: { username: string ; avatar: string }[];
}

export default defineComponent({
  data(): MyFriendsData {
    return {
      loading: true,
      friends: [],
    };
  },
  omponents: {
    'add-friend': AddFriend,
  },
  methods: {
    ...mapGetters(['avatar', 'id']),
  },
  async created() {
    let response = await axios.get('/users/' + this.id() + '/friendships/');
    for (let i: number = 0; i < response.data.length; i++) {
      this.friends.push({
        username: response.data[i].user.username,
        avatar: response.data[i].avatar,
      });
    } 
    this.loading = false;
  },
});
</script>

<style scoped>
li {
  list-style: none;
}
</style>
