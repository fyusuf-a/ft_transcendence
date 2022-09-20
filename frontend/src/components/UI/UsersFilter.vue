<template>
  <v-container>
    <div class="search-wrapper">
      <input type="text" v-model="search" placeholder="Search a user..."/>
    </div>

    <div v-for="user in filteredList()" :key="user.rating">
      <div v-if="search">
        <router-link :to="user.userLink">
          <div class="others flex">
            <div class="info flex">
              <p class="link">{{ user.user }}</p>
              <p class="points">{{ user.rating }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data: () => ({
    search: '',
  }),
  methods: {
    filteredList() {
      return this.users.filter((post: { user: string; }) => {
        return post.user.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  components: {
  },
  props: ['users'],
});
</script>
  
<style>
.search-wrapper {
    position: relative;
}

input {
  padding: 4px 12px;
  color: rgba(0,0,0,.70);
  border: 1px solid rgba(0,0,0,.12);
  transition: .15s all ease-in-out;
  background: white;
}

</style>
