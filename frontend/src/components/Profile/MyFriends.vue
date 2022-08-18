<template>
  <v-card :loading="loading" class="pa-2 ml-15 mr-15 mt-5" width="40%">
    <v-card-title class="white--text orange darken-4">
      Friends

      <v-spacer></v-spacer>

      <v-btn color="white" class="text--primary" fab small>
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <v-card>
      <v-list :items="users" />
    </v-card>
  </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import { ResponseFriendshipDto } from '@dtos/friendships';
import { PageDto } from '@dtos/pages';

interface MyFriendsData {
  loading: boolean;
  users: { value: number; title: string }[];
}

export default defineComponent({
  data(): MyFriendsData {
    return {
      loading: true,
      users: [],
    };
  },
  async created() {
    let response = await axios.get<PageDto<ResponseFriendshipDto>>(
      '/friendships/',
      {
        params: {
          sourceId: this.$store.getters.id,
          status: 'accepted',
        },
      },
    );
    response.data.data.forEach(async (friendship) => {
      let userResponse = await axios.get('/users/' + friendship.targetId);
      this.users.push({
        value: userResponse.data.id,
        title: userResponse.data.username,
      });
    });
    this.loading = false;
  },
});
</script>
