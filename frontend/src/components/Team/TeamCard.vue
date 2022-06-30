<template>
  <v-row>
    <v-col v-for="teamMate in teamMates" :key="teamMate.id">
      <v-card tile>
        <v-col align="center" class="mt-5">
          <v-avatar size="100">
            <v-img :src="teamMate.picture"></v-img>
          </v-avatar>
          <v-card-text class="text--primary">
            <div>{{ teamMate.login }}</div>
            <div>{{ teamMate.name }}</div>
          </v-card-text>
          <div>
            <a :href="teamMate.githubLink" target="_blank">
              <img id="github" :src="githubLogo" :alt="githubAlt" />
            </a>
          </div>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data: function () {
    return {
      teamMates: [
        {
          picture: require("@/assets/images/abouchau.jpg"),
          login: "abouchau",
          name: "Nina Bouchau",
          githubLink: "https://github.com/N-4-Nina",
          id: 1,
        },
        {
          picture: require("@/assets/images/fyusuf-a.jpg"),
          login: "fyusuf-a",
          name: "Florian Yusuf Ali",
          githubLink: "https://github.com/fyusuf-a",
          id: 2,
        },
        {
          picture: require("@/assets/images/mdesfont.jpg"),
          login: "mdesfont",
          name: "Louie Desfontaines",
          githubLink: "https://github.com/Mel-louie",
          id: 3,
        },
        {
          picture: require("@/assets/images/tmorris.jpg"),
          login: "tmorris",
          name: "Taylor Morris",
          githubLink: "https://github.com/tmorris42",
          id: 4,
        },
        {
          picture: require("@/assets/images/tvideira.jpg"),
          login: "tvideira",
          name: "Théo Videira",
          githubLink: "https://github.com/tvideira",
          id: 5,
        },
      ],
      githubLogo: require("@/assets/images/GitHub-Mark-120px-plus.png"),
      githubAlt: "github logo",
    };
  },
};
</script>

<style scoped>
#github {
  cursor: pointer;
  max-height: 30px;
}
</style>
