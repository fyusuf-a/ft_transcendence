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
          <li class="listFriends" v-for="friend in friends" :key="friend.username">
            <v-row>
              <v-col>
                <div class="listElement">
                  <v-img class="avatar" :src="friend.avatar"></v-img>
                  <v-badge overlap class="" :color="statusColors[friend.status]"></v-badge>
                  <p class="userName">{{ friend.username }}</p>
                  <v-spacer></v-spacer>
                  <v-btn v-if="friend.status === 2" @click="handleSpectate(friend.id)">Spectate</v-btn>
                  <v-btn v-if="friend.status === 1" @click="handleChallenge(friend.id)">Challenge</v-btn>
                  <v-spacer></v-spacer>
                  <br />
                </div>
              </v-col>
            </v-row>
          </li>

          <add-friend v-if="!user" class="mb-5 mt-5"/>

          <div v-if="!user">
            <v-divider></v-divider>
            <h3 class="mt-5">Pending friend requests</h3><br />
              <li v-for="requester in requesters" :key="requester.username">
                <v-row>
                  <v-col>
                    <div class="listPending">
                      <v-img class="avatar" :src="requester.avatar" ></v-img>
                      <p class="userName">{{ requester.username }}</p>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <div class="pb-3">
                    <v-btn color="success" variant="outlined" class="text--primary ml-15" title="accept" @click="accept(requester.frienshipId)">✔</v-btn>
                    <v-btn color="error" variant="outlined" class="text--primary ml-10" title="decline" @click="decline(requester.frienshipId)">✘</v-btn>
                  </div>
                </v-row>
              </li>
              <p v-if="!requesters.length" class="text--primary noRequest">
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
import { fetchAvatar } from '@/utils/avatar';
import { Socket } from 'socket.io-client';
import { StatusUpdateDto } from '@dtos/users'

import BlockUser from '@/components/Profile/BlockUser.vue'
interface MyFriendsData {
  loading: boolean;
  friends: { id: number, username: string ; avatar: string ; status: number, friendLink: string }[];
  requesters: { username: string ; avatar: string, frienshipId: number }[];
  tab: any,
  statusColors : string[],
  socket : Socket,
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
      statusColors : [
      'red',
      'green',
      'light-blue accent-3'
      ],
      socket: this.$store.getters.socket,
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
    handleStatusUpdate(statusUpdate: StatusUpdateDto) {
      this.friends.forEach(friend => {
        if (friend.id == statusUpdate.id) {
          friend.status = statusUpdate.status;
        }
          
      })
      console.log(statusUpdate);
    }, 
    async listOfFriends(id: number) {
      let response = await axios.get('/users/' + id + '/friendships/');
      for (let i: number = 0; i < response.data.length; i++) {
        this.friends.push({
          id: response.data[i].user.id,
          username: response.data[i].user.username,
          avatar: await fetchAvatar(response.data[i].user.id),
          status: response.data[i].user.status,
          friendLink: '/profile/' + response.data[i].user.username,
        });
      };
    },
    async unblock (blockedId: number) {
      await axios.delete('/blocks/' + blockedId);
      window.alert('The user has been unblock.');
      window.location.reload();
    },
    async handleSpectate(userId: number) {
      console.log("spectating user " + userId);
      await this.$store.dispatch('spectateUser', userId);
      this.$router.push('/game');
    },
    async handleChallenge(userId: number) {
      await this.$store.dispatch('challengeUser', userId);
      this.$router.push('/game');
    },
  },
  async created() {
    // get list of friends
    if (this.user) {
      let response = await axios.get(`/users/name/${this.user}`);
      this.listOfFriends(response.data.id);
    }
    else {
      this.listOfFriends(this.id());
    }

    // get list of requesters
    let response2 = await axios.get('/users/' + this.id() + '/friendships/invites');
    for (let i: number = 0; i < response2.data.length; i++) {
      this.requesters.push({
        username: response2.data[i].user.username,
        avatar: await fetchAvatar(response2.data[i].user.id),
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

    this.socket.on('status-update', this.handleStatusUpdate);
  },
});
</script>

<style scoped>
li {
  list-style: none;
}
.listFriends {
  background-color: beige;
}
.listElement {
  height: 50;
  width: 100%;
  background-color: beige;
  display: flex;
  padding: 15px 0 5px 5px;
}
.listPending {
  height: 50;
  width: 100%;
  display: flex;
  padding: 15px 0 5px 5px;
}
.avatar {
  display: flex;
  border-radius: 50%;
  max-height: 50px;
  max-width: 50px;
}
.userName {
  display: flex;
  float: left;
  padding-top: 10px;
  padding-left: 2em;
  font-weight: bold;
}
.noRequest {
  color: #03dac6;
}
</style>
