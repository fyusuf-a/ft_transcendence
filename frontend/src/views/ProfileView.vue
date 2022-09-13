<template>
  <div>
    <v-row>
      <my-profile />
      <my-friends />
      <my-matches/>
      <my-achievements/>
      <activate-two-fa />
    </v-row>
  </div>
</template>

<script lang="ts">
import MyFriends from '@/components/Profile/MyFriends.vue';
import MyProfile from '@/components/Profile/MyProfile.vue';
import ActivateTwoFA from '@/components/Profile/Activate2FA.vue';
import MyAchievements from '@/components/Profile/MyAchievements.vue';
import MyMatchHistory from '@/components/Profile/MyMatchHistory.vue'
import { defineComponent } from 'vue';
export default defineComponent({
  components: {
    'my-friends': MyFriends,
    'my-profile': MyProfile,
    'activate-two-fa': ActivateTwoFA,
    'my-achievements': MyAchievements,
    'my-matches': MyMatchHistory,
  },
});
</script>
