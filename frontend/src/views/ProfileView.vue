<template>
  <div>
    <v-row>
      <my-profile />
      <my-friends />
    </v-row>
  </div>
</template>

<script lang="ts">
import MyFriends from '@/components/Profile/MyFriends.vue';
import MyProfile from '@/components/Profile/MyProfile.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    'my-friends': MyFriends,
    'my-profile': MyProfile,
  },
});
</script>
