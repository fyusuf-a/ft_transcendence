<template>
  <v-container>
    <div>
      FILTER
    </div>
    <div>
      <div class="controls">
        <v-btn>Refresh</v-btn>
      </div>
      <ul>
        <li v-for="user in users" :key="user.rating">
          {{ user.user }} {{ user.rating }} <router-link :to="user.userLink">View Details</router-link>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface UsersList {
  users: { user: string, rating: number, userLink: string }[];
}

export default defineComponent({
  data(): UsersList {
    return {
      users: [],
    };
  },
  
  computed: {

  },
  methods: {

  },
  async created() {
    let response = await axios.get('/users/');
    for (let i: number = 0; i < response.data.data.length; i++) {
      this.users.push({
        user: response.data.data[i].username,
        rating: response.data.data[i].rating,
        userLink: '/profile/' + response.data.data[i].username,
      });
    };
  },
  components: {

  },
});
</script>
