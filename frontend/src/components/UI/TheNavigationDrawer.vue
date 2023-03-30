<template>
  <v-navigation-drawer
    mini-variant
    mini-variant-width="56"
    expand-on-hover
    color="secondary"
    clipped
    app
    @update:modelValue="emitModelValue"
    :modelValue="modelValue"
  >
    <v-divider></v-divider>

    <v-list density="compact" nav class="bg-color">
      <v-list-item
        color="primary"
        v-for="item in items"
        :key="item.title"
        :to="item.route"
        :prepend-icon="item.icon"
        :title="item.title"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  emits: ['update:modelValue'],
  methods: {
    emitModelValue(value: boolean) {
      this.$emit('update:modelValue', value);
    },
  },
  data() {
    return {
      expanded: this.visible,
      items: [
        {
          title: 'Profile',
          icon: 'mdi-account',
          route: '/profile',
        },
        {
          title: 'Play',
          icon: 'mdi-gamepad-variant',
          route: '/game',
        },
        {
          title: 'Chat',
          icon: 'mdi-forum',
          route: '/chat',
        },
        {
          title: 'Leaderboard',
          icon: 'mdi-numeric-1-box',
          route: '/leaderboard',
        },
        {
          title: 'About',
          icon: 'mdi-information-outline',
          route: '/about',
        },
        {
          title: 'Logout',
          icon: 'mdi-logout',
          route: '/logout',
        },
      ],
    };
  },
});
</script>
