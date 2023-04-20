<template>
  <v-sheet class="mx-auto">
    <v-form validate-on="submit" @submit.prevent="register">
      <v-text-field
        label="Username"
        v-model="username"
        :error-messages="errors"
      ></v-text-field>
      <v-btn color="primary" type="submit" block class="mt-2"
        >Create user</v-btn
      >
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { UpdateUserDto } from '@dtos/users/update-user.dto';
import axios from 'axios';
import { AxiosError } from 'axios';

export default defineComponent({
  data() {
    return {
      username: '',
      errors: [] as string[],
    };
  },
  methods: {
    async register() {
      let dto = new UpdateUserDto();
      if (this.username) {
        dto.username = this.username;
      } else {
        this.errors.push('Username is required');
        return;
      }
      try {
        await axios.patch('/users/me', dto);
        this.$store.state.user.username = this.username;
        this.$router.push('/');
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          this.errors.push(
            `Username already exists, try ${error.response.data.suggestedUsername}`,
          );
        }
      }
    },
  },
});
</script>

<style scoped>
.v-sheet {
  width: 360px;
  padding: 20px 10px;
}

.v-btn:hover {
  transform: scale(1.05);
}
</style>
