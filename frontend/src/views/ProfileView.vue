<template>
  <div>
    <v-row>
      <my-profile />
      <my-friends />
    </v-row>
  </div>
</template>

<script>
import MyFriends from '@/components/Profile/MyFriends.vue';
import MyProfile from '@/components/Profile/MyProfile.vue';

export default {
  components: {
    'my-friends': MyFriends,
    'my-profile': MyProfile,
  },
};
</script>
