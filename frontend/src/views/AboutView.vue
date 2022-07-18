<template>
  <v-container>
    <div id="about">
      <h1>About</h1>
      <h2>ft_transcendence</h2>
      <br />
      <p>
        ft_transcendence is the last project of the 42 common core. It is
        designed to complete the first part of our cursus. We had to program, as
        a team, something completely different from what we have done so far. We
        were supposed to create a website where users can face each other in
        Pong games. The website where you are now! <br />The specifications
        included: a nice user interface, a chat, and real-time multiplayer
        online games, compatible with the latest stable up-to-date version of
        Google Chrome, Firefox, and Safari. <br />We have developed our website
        with these technologies:
      </p>
      <ul>
        <li>backend: NestJS;</li>
        <li>frontend: TypeScript, with Vue.js as a framework;</li>
        <li>database: PostgreSQL.</li>
      </ul>
      <br />
      <p>
        For more information about the rules we had to follow, you can check our
        <a
          href="https://github.com/fyusuf-a/ft_transcendence/blob/master/README.md"
          target="_blank"
          >README.md</a
        >.
      </p>
    </div>
    <div>
      <h2>Our team</h2>
      <br />
      <v-container class="grey lighten-5">
        <team-card :members="member" />
      </v-container>
    </div>
  </v-container>
</template>

<script lang="ts">
import TeamCard from '@/components/Team/TeamCard.vue';
import Vue from 'vue';

export default Vue.extend({
  components: {
    'team-card': TeamCard,
  },
});
</script>

<style scoped>
#about {
  padding: 40px 0 0 0;
}
</style>
