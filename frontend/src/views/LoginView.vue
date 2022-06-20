<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      username: "string",
    };
  },
  methods: {
    async authenticate() {
      let rawResponse = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: this.username }),
      });
      console.log(rawResponse);
      if (rawResponse.status !== 201) {
        console.log(`Server[${rawResponse.status}]: ${rawResponse.statusText}`);
        return;
      }
      let content = await rawResponse.json();
      const token = content.access_token;
      if (token === undefined) {
        console.log(`Could not login as user ${this.username}`);
        return;
      }
      this.$store.commit("login", {
        username: this.username,
        token: token,
      });

      this.authenticateSocket();
      this.$router.push("/profile");
    },
    async authenticateSocket() {
      console.log("trying to auth socket");
      this.$socket.client.emit(
        "chat-auth",
        { authorization: `${this.$store.state.user.token}` },
        (response: string) => {
          console.log(response);
        }
      );
      this.$store.commit("login", {
        username: this.$store.state.user.username,
        token: this.$store.state.user.token,
      });
    },
  },
});
</script>

<template>
  <v-form @submit.prevent.stop>
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
          <v-btn color="primary" @click="authenticate">Sign-in</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
