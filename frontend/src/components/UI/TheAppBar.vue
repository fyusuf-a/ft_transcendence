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

    <notification-icon
      @click="notification = !notification"
      :alert="notification"
    />
  </v-app-bar>
</template>

<script>
import NotificationIcon from "@/components/Notifications/NotificationIcon.vue";
import ProfileCard from "@/components/Profile/ProfileCard.vue";

export default {
  props: ["value"],
  events: ["input"],
  components: {
    "profile-card": ProfileCard,
    "notification-icon": NotificationIcon,
  },
  data() {
    return {
      notification: true,
    };
  },
  methods: {
    toggleNavigationDrawer() {
      this.$emit("input", !this.value);
    },
  },
};
</script>
