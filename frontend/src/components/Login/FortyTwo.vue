<template>
  <v-sheet>
    <h1 class="mb-15">ft_transcendence</h1>
    <v-progress-circular
      v-if="waiting"
      indeterminate
      class="d-block"
      :size="70"
      :width="7"
      color="primary"
    />
    <v-card v-if="!isTwoFAEnabled && !waiting" color="secondary">
      <v-card-title class="mb-7">Sign-in</v-card-title>
      <v-card-actions>
        <v-btn @click="login()" class="mb-3">Login with 42 </v-btn>
        <v-btn @click="login()" prepend-icon="fa-brands fa-google"
          >Login with Google
        </v-btn>
      </v-card-actions>
    </v-card>
    <two-fa v-if="isTwoFAEnabled && !waiting" @success="goToProfile" />
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TwoFA from '@/components/Login/TwoFA.vue';

export default defineComponent({
  components: {
    'two-fa': TwoFA,
  },
  data() {
    return {
      isTwoFAEnabled: false,
      waiting: true,
    };
  },
  methods: {
    authenticate() {
      window.location.href = '/api/auth/callback';
    },
    goToProfile() {
      this.waiting = true;
      this.$router.push('/profile');
    },
    async login() {
      this.waiting = true;
      this.authenticate();
    },
  },
  async created() {
    this.waiting = true;
    if (this.$route.query.id && this.$route.query.token) {
      try {
        const user = await this.$store.dispatch('verifyLoginInfo', {
          id: this.$route.query.id,
          token: this.$route.query.token,
        });
        if (user.isTwoFAEnabled) {
          this.waiting = false;
          this.isTwoFAEnabled = true;
        } else {
          this.goToProfile();
        }
      } catch (error) {
        console.error(error);
        this.waiting = false;
      }
      return;
    } else {
      this.waiting = false;
    }
  },
});
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.v-sheet {
  margin: 3rem auto;
  width: 400px;
}

.v-card-actions .v-btn ~ .v-btn {
  margin-inline-start: 0;
}

.v-card-actions {
  flex-direction: column;
  padding-left: 1rem;
  padding-right: 1rem;
}

.v-btn {
  transition-property: transform();
  transition-duration: 0.2s;
  width: 100%;
}

.v-btn:hover {
  transform: scale(1.05);
}

.v-progress-circular {
  margin: 0 auto;
}
</style>
