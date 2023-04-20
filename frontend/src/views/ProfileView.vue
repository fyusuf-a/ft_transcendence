<template>
  <div>
    <v-row>
      <v-card class="pa-2 ml-15 mr-15 mt-5" width="84%">
        <my-username />
        <v-container fluid>
          <v-row dense>
            <v-col :cols="4">
              <my-avatar class="mr-10" />
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
import MyAvatar from '@/components/Profile/MyAvatar.vue';
import MyMatchHistory from '@/components/Profile/MyMatchHistory.vue';
import MyStatistics from '@/components/Profile/MyStatistics.vue';
import MyUsername from '@/components/Profile/MyUsername.vue';
import { UserDto } from '@/dtos/users';
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
import axios from 'axios';

interface Users {
  users: Map<number, UserDto>;
}

export default defineComponent({
  data(): Users {
    return {
      users: new Map(),
    };
  },
  props: ['user'],
  components: {
    'my-friends': MyFriends,
    'activate-two-fa': ActivateTwoFA,
    'my-achievements': MyAchievements,
    'my-avatar': MyAvatar,
    'my-matches': MyMatchHistory,
    'my-statistics': MyStatistics,
    'my-username': MyUsername,
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
  },
});
</script>
