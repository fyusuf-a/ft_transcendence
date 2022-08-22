<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="username"
            label="Username"
            required
          ></v-text-field>
        </v-col>
        <v-col>
          <v-btn @click="authenticate" color="primary">Sign-in</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      username: 'string',
      loading: false,
    };
  },
  methods: {
    async authenticate() {
      if (this.loading) return;
      this.loading = true;
      let response = await axios.post('/auth/login', {
        username: this.username,
      });
      if (response.data.access_token === undefined) {
        console.log(`Could not login as user ${this.username}`);
        return;
      }
      this.$store.commit('login', {
        id: response.data.id,
        username: this.username,
        token: response.data.access_token,
      });
      this.$router.push('/profile');
      this.loading = false;
    },
  },
});
</script>
