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
        <li v-for="user in filteredUsers" :key="user.id">
          {{ user.username }}
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';

export default defineComponent({
  computed: {
    filteredUsers() {
      // console.log("store: " + this.$store.getters.usersList);
      // console.log("hmm: " + this.$store.getters('users/users'));
      return this.$store.getters['usersModule/users'];
    },
  },
  methods: {
    
   
  },
  created() {
   
  },
  components: {
    
  },
});
</script>
