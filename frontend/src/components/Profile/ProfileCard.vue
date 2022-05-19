<template>
  <v-card :color="color" class="ma-y8" elevation="0">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="profile.picture" :alt="profile.pseudo" />
      </v-list-item-avatar>
      <v-list-item-content>
        {{ profile.pseudo }}
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: "primary",
    },
    profile: {
      type: Object,
      required: true,
    },
  },
  methods: {
  },
};
</script>

<style scoped>
:hover {
  color: #fff;
}
</style>
