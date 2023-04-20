<template>
  <v-app-bar color="primary" dark app clipped-left>
    <v-app-bar-nav-icon @click="toggleNavigationDrawer()" />
    <v-app-bar-title> King Pong </v-app-bar-title>

    <v-spacer />

    <profile-card
      v-if="$store.getters.isUserAuthenticated"
      rounded="0"
      color="secondary"
      height="100%"
    />

    <notification-icon @click="toggleNotifications()" />
  </v-app-bar>
</template>

<script lang="ts">
import NotificationIcon from '@/components/Notifications/NotificationIcon.vue';
import ProfileCard from '@/components/Profile/ProfileCard.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    displayNotifications: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    'profile-card': ProfileCard,
    'notification-icon': NotificationIcon,
  },
  methods: {
    toggleNavigationDrawer() {
      this.$emit('update:modelValue', !this.modelValue);
    },
    toggleNotifications() {
      this.$emit('update:displayNotifications', !this.displayNotifications);
    },
  },
});
</script>
