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
import config from '@/config';
import axios from 'axios';
import { UpdateUserDto, UserDto } from '@dtos/users';
import { PageDto } from '@dtos/pages';

export default defineComponent({
  data() {
    return {
      login: '',
      alertShown: false,
      errors: [] as string[],
    };
  },
  methods: {
    async verifyLogin() {
      this.errors.pop();
      if (this.login.length === 0) return;
      try {
        let response = await axios.get('users', {
          params: {
            username: this.login,
          },
        });
        if (response.data?.data.length === 0) {
          throw new Error('Login not found');
        }
        this.$store.dispatch('verifyLoginInfo', {
          id: response.data.data[0].id,
          token: 'dummy_token',
        });
        this.alertShown = true;
        setTimeout(() => {
          this.$router.push('/profile');
        }, 1500);
        return;
      } catch (e) {
        this.errors.push('Invalid login');
      }
    },
  },
});
</script>
