<template>
  <v-app-bar color="primary" dark app clipped-left>
    <v-app-bar-nav-icon @click="toggleNavigationDrawer()" />
    <v-app-bar-title>
      <div color="primary">King Pong</div>
    </v-app-bar-title>

    <v-spacer />

    <profile-card
      v-if="$store.state.isAuthenticated"
      color="primary"
      height="100%"
    />

    <notification-icon />
  </v-app-bar>
</template>

<script lang="ts">
import NotificationIcon from '@/components/Notifications/NotificationIcon.vue';
import ProfileCard from '@/components/Profile/ProfileCard.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['modelValue'],
  components: {
    'profile-card': ProfileCard,
    'notification-icon': NotificationIcon,
  },
  methods: {
    toggleNavigationDrawer() {
      this.$emit('update:modelValue', !this.modelValue);
    },
  },
});
</script>
