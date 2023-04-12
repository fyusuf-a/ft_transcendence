<template>
  <v-card color="secondary">
    <v-card-title class="mb-7">Sign-in</v-card-title>
    <v-card-actions>
      <v-btn @click="login('marvin')" class="mb-3">Login with 42 </v-btn>
      <v-btn @click="login('google')" prepend-icon="fa-brands fa-google"
        >Login with Google
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  emits: ['activate-waiting'],
  methods: {
    login(apiName: string) {
      this.$emit('activate-waiting');
      window.location.href = `/api/auth/callback/${apiName}`;
    },
  },
});
</script>

<style scoped>

.v-card-actions .v-btn ~ .v-btn {
  margin-inline-start: 0;
}

.v-card-actions {
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
}

.v-btn {
  background-color: rgb(var(--v-theme-primary)) !important;
  transition-property: transform();
  transition-duration: 0.2s;
  width: 100%;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
