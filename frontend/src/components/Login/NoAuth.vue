<template>
  <div>
    <v-form>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              label="Login"
              v-model="login"
              @input="verifyLogin"
              :rules="[(v: string) => !!v || 'Login is required']"
              :error-messages="errors"
              prepend-inner-icon="mdi-account"
              v-if="!alertShown"
            />
            <v-alert type="success" v-else> Success </v-alert>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      login: '',
      alertShown: false,
      errors: [] as string[],
    };
  },
  async created() {
    if (this.$route.query.id && this.$route.query.token) {
      try {
        await this.$store.dispatch('verifyLoginInfo', {
          id: this.$route.query.id,
          token: this.$route.query.token,
        });
        this.goToProfile();
      } catch (error) {
        console.error(error);
      }
    }
  },
  methods: {
    async authenticate({ username }: { username: string }) {
      window.location.href = `/api/auth/fake-callback?username=${username}`;
    },
    goToProfile() {
      this.$router.push('/profile');
    },
    async verifyLogin() {
      this.errors.pop();
      if (this.login.length === 0) return;
      try {
        await axios.get('auth/fake-token', {
          params: {
            username: this.login,
          },
        });
        this.alertShown = true;
        setTimeout(() => {
          this.authenticate({ username: this.login });
          this.alertShown = false;
        }, 1500);
      } catch (e) {
        this.errors.push('Invalid login');
      }
    },
  },
});
</script>
