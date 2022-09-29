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
              <v-card-actions class="pt-10">
                <v-row>
                  <username-button />
                  <avatar-button />
                </v-row>
              </v-card-actions>
            </v-col>
            <v-col :cols="8">
              <my-statistics :user="user" />
            </v-col>
          </v-row>
        </v-container>
      </v-card>
      <my-friends :user="user" />
      <my-matches :user="user" />
      <my-achievements :user="user" />
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
}

export default defineComponent({
  data(): Users {
    return {
      users: new Map(),
      username: '',
      avatar: '',
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
  },
  async created() {
    const newUser: UserDto = await this.fetchUserById(this.id());
    this.users.set(this.id(), newUser);
    this.username = newUser.username;
    this.avatar = await this.$store.dispatch(
      'getAvatarById',
      this.id().toString(),
    );
  }
});
</script>
