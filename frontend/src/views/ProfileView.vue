<template>
  <div>
    <v-row>
      <my-profile />
      <my-matches/>
      <my-friends />
      <my-achievements/>
    </v-row>
  </div>
</template>

<script lang="ts">
import MyFriends from '@/components/Profile/MyFriends.vue';
import MyProfile from '@/components/Profile/MyProfile.vue';
import MyAchievements from '@/components/Profile/MyAchievements.vue';
import MyMatchHistory from '@/components/Profile/MyMatchHistory.vue'
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    'my-friends': MyFriends,
    'my-profile': MyProfile,
    'my-achievements': MyAchievements,
    'my-matches': MyMatchHistory,
  },
});
</script>
