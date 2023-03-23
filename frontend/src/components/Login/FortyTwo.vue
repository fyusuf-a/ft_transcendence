<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col>
          <v-btn
            @click="login()"
            color="success"
            v-if="!isTwoFAEnabled && !waiting"
            >Login or Create Account</v-btn
          >
          <v-progress-circular v-if="waiting" indeterminate color="primary" />
          <two-fa v-if="isTwoFAEnabled" @success="goToProfile" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import config from '../../config';
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
      window.location.href = `${config.backendURL}/auth/callback`;
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    async login() {
      this.waiting = true;
      this.authenticate();
      this.waiting = false;
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
