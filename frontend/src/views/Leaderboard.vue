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
        <li class="list" v-for="user in sortedArray()" :key="user.rating">
          <router-link :to="user.userLink">
            <div class="rest">
              <div class="others flex">
                <div class="rank" >
                  <p class="num"> {{ rank }} </p>
                </div>
                <div class="info flex">
                  <p class="link">{{ user.user }}</p>
                  <p class="points">{{ user.rating }}</p>
                </div>
              </div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

interface UsersList {
  users: { id: number, user: string, rating: number, userLink: string }[];
  rank: number;
}

export default defineComponent({
  data(): UsersList {
    return {
      users: [],
      rank: 0,
    };
  },
  
  computed: {
  },
  methods: {
    sortedArray() {
      return this.users.sort((a: { rating: number; }, b: { rating: number; }) => b.rating - a.rating);
    },
    incrementRank () {
    	this.rank += 1;
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
  components: {
  },
});
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
 
li:hover {
  padding: 1px 5px 1px 3px;
}


.num{
  color: black;
}


a, .link{
  text-decoration: none;
  margin: 0.2rem 0;
  color: black;
  margin-top: -0.3rem;
  font-size: 20px;
}


.points{
  color: black;
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
  align-items: center;
  justify-content: center;
}

.info{
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 30px;
  background: rgba(210, 255, 213, 0.3);
}

.info .points{
  margin-left: 0.2rem;
  margin-right: 1.2rem;
}

.info .link{
  margin: 0 1rem;
}

.rank{
  display: flex;
  align-items: center;
  margin: 0 1rem;
  flex-direction: column-reverse;
}

.rank i{
  margin-top: -5px !important;
}

.rank .num{
  margin: 0 !important; 
}
</style>
