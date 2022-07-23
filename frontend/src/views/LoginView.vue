<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-progress-circular indeterminate color="primary" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import config from '../config';

export default defineComponent({
  methods: {
    async authenticate() {
      window.location.href = `${config.backendURL}/auth/callback`;
    },
  },
  async created() {
    if (this.$route.query.id && this.$route.query.token) {
      await this.$store.commit('login', {
        id: this.$route.query.id,
        token: this.$route.query.token,
      });
    }
    if (this.$store.getters.userIsAuthenticated) {
      if (this.$store.getters.username) {
        this.$router.push('/profile');
        return;
      } else {
        this.$router.push('/create-account');
        return;
      }
    }
    this.authenticate();
  },
});
</script>
