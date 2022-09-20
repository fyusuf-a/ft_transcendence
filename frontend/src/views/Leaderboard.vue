<template>
  <v-container>
    <users-filter :users="users" />
    <ol>
      <div class="title flex">
        <p class="rank">Rank</p>
        <p class="username">Username</p>
        <p class="rating">Rating</p>
      </div>
      <li class="list" v-for="user in sortedArray()" :key="user.rating">
        <v-divider></v-divider>
        <router-link :to="user.userLink">
          <div class="others flex">
            <div class="info flex">
              <p class="link">{{ user.user }}</p>
              <p class="score">{{ user.rating }}</p>
            </div>
          </div>
        </router-link>
      </li>
    </ol>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import UsersFilter from '@/components/UI/UsersFilter.vue'

interface UsersList {
  users: { id: number, user: string, rating: number, userLink: string }[];
}

export default defineComponent({
  data(): UsersList {
    return {
      users: [],
    };
  },
  components: {
    'users-filter': UsersFilter,
  },
  methods: {
    sortedArray() {
      return this.users.sort((a: { rating: number; }, b: { rating: number; }) => b.rating - a.rating);
    },
  },
  async created() {
    let response = await axios.get('/users/');
    for (let i: number = 0; i < response.data.data.length; i++) {
      this.users.push({
        id: response.data.data[i].id,
        user: response.data.data[i].username,
        rating: response.data.data[i].rating,
        userLink: '/profile/' + response.data.data[i].username,
      });
    };
  },
});
</script>

<style>
ol {
  margin: 75px;
  list-style-type: decimal-leading-zero;
  color: #6200ee;
}

ol > li::marker {
  font-weight: bold;
}

li {
  padding-bottom: 15px;
}

a, .link{
  text-decoration: none;
  margin: 0.2rem 0;
  color: white;
  margin-top: -0.3rem;
  font-size: 20px;
}

.score{
  color: white;
  font-size: 20px;
}

.flex{
  display: flex;
  align-items: center;
}

.others{
  display: flex;
  width: 100%;
  margin-top: 1rem;
  align-items: left;
  justify-content: center;
}

.info{
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
  background: linear-gradient(90deg, rgba(98,0,238,1) 0%, rgba(120,9,121,1) 59%, rgba(252,70,107,1) 100%); 
}

.title{
  display: flex;
  width: 80%;
  justify-content: space-between;
  border-radius: 30px;
}

.rank .username{
  color: black;
  font-size: 20px;
  color: #6200ee;
}

.rating{
  color: #6200ee;
  font-size: 20px;
  padding-left: 20%;
}

.info .score{
  margin-left: 0.2rem;
  margin-right: 1.2rem;
}

.info .link{
  margin: 0 1rem;
}

</style>
