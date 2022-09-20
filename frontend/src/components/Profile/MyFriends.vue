<template>
  <v-card :loading="loading" class="pa-2 ml-15 mr-15 mt-5" width="40%">
    <v-tabs
      v-model="tab"
      background-color="white"
    >
      <v-tab value="friends">Friends</v-tab>
      <v-tab v-if="!user" value="blocked">Blocked</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="friends">
          <li v-for="friend in friends" :key="friend.username">
            {{ friend.username }}
            <v-img :src="friend.avatar" ></v-img>
          </li>

          <add-friend v-if="!user" class="mb-5 mt-5"/>

          <div v-if="!user">
            <v-divider></v-divider>

            <h3 class="mt-5">Pending friend requests</h3><br />
              <li v-for="requester in requesters" :key="requester.username">
                <div>{{ requester.username }}</div>
                <v-btn color="success" variant="outlined" class="text--primary ml-15" @click="accept(requester.frienshipId)">accept</v-btn>
                <v-btn color="error" variant="outlined" class="text--primary ml-10" @click="decline(requester.frienshipId)">decline</v-btn>
                <v-img :src="requester.avatar" ></v-img>
                <br />
              </li>
              <p v-if="!requesters.length" class="text--primary">
                No request to accept.
              </p>
            </div>
        </v-window-item>
        <v-window-item value="blocked">
          <li v-for="blocke in blocked" :key="blocke.username">
            {{ blocke.username }} <br />
            <v-btn color="error" variant="outlined" class="text--primary ml-15" @click="unblock(blocke.blockedId)">unblock</v-btn>
          </li>

          <block-user class="mb-5 mt-5"/>

        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import AddFriend from '@/components/Profile/AddFriend.vue';
import BlockUser from '@/components/Profile/BlockUser.vue'
interface MyFriendsData {
  loading: boolean;
  friends: { username: string ; avatar: string }[];
  requesters: { username: string ; avatar: string, frienshipId: number }[];
  tab: any,
  blocked: { username: string ; blockedId: number }[],
  idOther: number,
}
export default defineComponent({
  data(): MyFriendsData {
    return {
      loading: true,
      friends: [],
      requesters: [],
      tab: null,
      blocked: [],
      idOther: 0,
    };
  },
  props: ['user'],
  components: {
    'add-friend': AddFriend,
    'block-user': BlockUser,
  },
  methods: {
    ...mapGetters(['avatar', 'id']),
    async accept (frienshipId: number) {
      const data = {
        id: frienshipId,
        status: "accepted"
      };      
      await axios.patch('/friendships/' + frienshipId, data)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch( (error) => {
          console.log(error.response.status);
        });
    },
    async decline (frienshipId: number) {
      await axios.delete('/friendships/' + frienshipId)
        .then(response => {
          console.log(response);
          window.location.reload();
        })
        .catch( (error) => {
          console.log(error.response.status);
        });
    },
    async listOfFriends(id: number) {
      let response = await axios.get('/users/' + id + '/friendships/');
      for (let i: number = 0; i < response.data.length; i++) {
        this.friends.push({
          username: response.data[i].user.username,
          avatar: response.data[i].avatar,
        });
      };
    },
    async unblock (blockedId: number) {
      await axios.delete('/blocks/' + blockedId);
      window.alert('The user has been unblock.');
      window.location.reload();
    },
  },
  async created() {
    // get list of friends
    if (this.user) {
      let response = await axios.get('/users/');
      for (let i: number = 0; i < response.data.data.length; i++) {
        if (this.user === response.data.data[i].username) {
          this.idOther = response.data.data[i].id
        }
      };
      if (this.idOther == this.id()) {
        this.listOfFriends(this.id());
      }
      else {
        this.listOfFriends(this.idOther);
      }
      }
    else {
      this.listOfFriends(this.id());
    }

    // get list of requesters
    let response2 = await axios.get('/users/' + this.id() + '/friendships/invites');
    for (let i: number = 0; i < response2.data.length; i++) {
      this.requesters.push({
        username: response2.data[i].user.username,
        avatar: response2.data[i].avatar,
        frienshipId: response2.data[i].id,
      });
    };
    // get list of blocked users
    let response3 = await axios.get('/users/' + this.id() + '/blocks/');
    for (let i: number = 0; i < response3.data.length; i++) {
      this.blocked.push({
        username: response3.data[i].user.username,
        blockedId: response3.data[i].id,
      });
    };
    this.loading = false;
  },
});
</script>

<style scoped>
li {
  list-style: none;
}
p {
  color: #03dac6;
}
</style>
