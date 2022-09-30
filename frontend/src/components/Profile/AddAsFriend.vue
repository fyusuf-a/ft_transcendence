<template>
    <v-btn color="white" class="text--primary" @click="validate()">
      Add {{ name }} as friend
    </v-btn>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import { mapGetters } from 'vuex';
  import axios from 'axios';

  export default defineComponent({
    data: () => ({
      valid: true,
      name: '',
    }),
    props: ['user'],
    methods: {
      ...mapGetters(['id']),
      validate () {
        this.checkName(this.name);
      },
      async checkName (name: string) {
        const data = {
          sourceId: parseInt(this.id()),
          targetId: 0
        };
        let response2 = await axios.get('/users/' + this.id() + '/friendships/');
        for (let i: number = 0; i < response2.data.length; i++) {
          console.log(response2.data[i])
          if (response2.data[i].user.username === name) {
            window.alert('This user is already your friend :)');
            return;
          }
        };
        let response3 = await axios.get('/users/' + this.id() + '/friendships/invites');
        for (let i: number = 0; i < response3.data.length; i++) {
          if (response3.data[i].user.username === name) {
            window.alert('This user already sends you a friend request. Check your pending requests :)');
            return;
          }
        };
        await axios.post('/friendships/' + name, data)
          .then(async response => {
            console.log(response);
            window.alert('Your friend request has been sent.');
          })
          .catch( (error) => {
            console.error('There\'s already a friend request pending between those users');
            window.alert('There\'s already a friend request pending between you and this user');
          });
      },
    },
    async created() {
        this.name = this.user;
    }
  });
  </script>
  