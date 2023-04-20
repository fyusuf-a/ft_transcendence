<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="username"
            label="Username"
            required
            :rules="rules"
            :error-messages="errorMessages"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="createAccount" color="primary">Create account</v-btn>
          <v-progress-circular v-if="isWaiting" indeterminate color="primary" />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UpdateUserDto } from '@dtos/users';
import axios from 'axios';
import { UserDto } from '@dtos/users';

interface DataType {
  username: string;
  rules: ((value: string) => boolean | string)[];
  errorMessages: string[];
  isWaiting: boolean;
}

export default defineComponent({
  data(): DataType {
    return {
      username: '',
      rules: [(value: string) => !!value || 'Required'],
      errorMessages: [] as string[],
      isWaiting: true,
    };
  },
  methods: {
    async createAccount() {
      this.isWaiting = true;
      if (!this.username && this.username.trim() === '') {
        this.errorMessages = ['Required'];
        return;
      }
      const updateUserDto = {
        username: this.username.trim(),
      };
      try {
        await axios.patch<UpdateUserDto, UserDto>(
          `/users/${this.$store.getters.id}`,
          updateUserDto,
        );
        this.$store.commit('setUsername', updateUserDto.username);
        this.$router.push('/');
      } finally {
        this.isWaiting = false;
      }
    },
  },
  created() {
    this.isWaiting = false;
  },
});
</script>
