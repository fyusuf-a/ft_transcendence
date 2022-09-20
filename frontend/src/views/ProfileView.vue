<template>
  <div>
    <v-row>
      <v-card class="pa-2 ml-15 mr-15 mt-5" width="84%" >
        <v-card-title>{{ username }}</v-card-title>
        <v-container fluid>
          <v-row dense>
            <v-col :cols="4">
              <v-card class="mr-10" max-width="400"  >
                <v-img
                :src="avatar"
                ></v-img>
              </v-card>
              <v-card-actions v-if="!user" class="pt-10">
                <v-row>
                  <avatar-button />
                  <username-button />
                </v-row>
              </v-card-actions>
            </v-col>
            <v-col v-if="idOther || !user" :cols="8">
              <my-statistics :user="user" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <my-friends :user="user" />
      <my-matches/>
      <my-achievements />
      <activate-two-fa v-if="!user" />
    </v-row>
  </div>
</template>

<script lang="ts">
import MyFriends from '@/components/Profile/MyFriends.vue';
import ActivateTwoFA from '@/components/Profile/Activate2FA.vue';
import MyAchievements from '@/components/Profile/MyAchievements.vue';
import MyMatchHistory from '@/components/Profile/MyMatchHistory.vue';
import MyStatistics from '@/components/Profile/MyStatistics.vue';
import ChangeUsername from '@/components/Profile/ChangeUsername.vue';
import ChangeAvatar from '@/components/Profile/ChangeAvatar.vue';
import { UserDto } from '@/dtos/users';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';

interface Users {
  users: Map<number, UserDto>;
  username: string,
  avatar: string,
  idUserLogin: number,
  idOther: number,
}

export default defineComponent({
  data(): Users {
    return {
      users: new Map(),
      username: '',
      avatar: '',
      idUserLogin: 0,
      idOther: 0,
    };
  },
  props: ['user'],
  components: {
    "my-friends": MyFriends,
    "activate-two-fa": ActivateTwoFA,
    "my-achievements": MyAchievements,
    "my-matches": MyMatchHistory,
    "my-statistics": MyStatistics,
    "username-button": ChangeUsername,
    "avatar-button": ChangeAvatar,
  },
  methods: {
    ...mapGetters(['id']),
    async fetchUserById(userId: number) {
      const response = await axios.get(`/users/${userId}`);
      if (response.data) {
        return response.data;
      } else {
        return { id: -1, username: 'Unknown User' };
      }
    },
    async getUserInfo(id: number) {
      const newUser: UserDto = await this.fetchUserById(id);
        this.users.set(id, newUser);
        this.username = newUser.username;
        this.idUserLogin = id;
        this.avatar = await this.$store.dispatch(
          'getAvatarById',
          this.idUserLogin.toString(),
          );
    },
  },
  async created() {
    if (this.user) {
      let response = await axios.get('/users/');
      for (let i: number = 0; i < response.data.data.length; i++) {
        if (this.user === response.data.data[i].username) {
          this.idOther = response.data.data[i].id
        }
      };
      if (this.idOther == 0) {
        this.$router.push({
          name: '404',
          params: { path: '/404' },
        });
        return;
      }
      else if (this.idOther == this.id()) {
        this.getUserInfo(this.id());
      }
      else {
        this.getUserInfo(this.idOther);
      }
    }
    else {
      this.getUserInfo(this.id());
    }
  }
});
</script>
