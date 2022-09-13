<template>
  <div>
    <my-profile />
    <my-friends />
    <activate-two-fa />
  </div>
</template>

<script lang="ts">
import MyFriends from '@/components/Profile/MyFriends.vue';
import MyProfile from '@/components/Profile/MyProfile.vue';
import ActivateTwoFA from '@/components/Profile/Activate2FA.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    'my-friends': MyFriends,
    'my-profile': MyProfile,
    'activate-two-fa': ActivateTwoFA,
  },
});
</script>
