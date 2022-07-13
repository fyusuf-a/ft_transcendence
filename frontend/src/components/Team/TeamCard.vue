<template>
  <v-row>
    <v-col v-for="teamMate in teamMates" :key="teamMate.id">
      <v-card tile>
        <v-col align="center" class="mt-5">
          <v-avatar size="100">
            <v-img :src="teamMate.picture" :lazy-src="teamMate.lazyPicture">
              <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular
                    indeterminate
                    color="teal"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
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
          picture: "https://cdn.intra.42.fr/users/abouchau.jpg",
          lazyPicture: require("@/assets/images/abouchau-lazy.jpg"),
          login: "abouchau",
          name: "Nina Bouchau",
          githubLink: "https://github.com/N-4-Nina",
          id: 1,
        },
        {
          picture: "https://cdn.intra.42.fr/users/fyusuf-a.jpg",
          lazyPicture: require("@/assets/images/fyusuf-a-lazy.jpg"),
          login: "fyusuf-a",
          name: "Florian Yusuf Ali",
          githubLink: "https://github.com/fyusuf-a",
          id: 2,
        },
        {
          picture: "https://cdn.intra.42.fr/users/mdesfont.jpg",
          lazyPicture: require("@/assets/images/mdesfont-lazy.jpg"),
          login: "mdesfont",
          name: "Louie Desfontaines",
          githubLink: "https://github.com/Mel-louie",
          id: 3,
        },
        {
          picture: "https://cdn.intra.42.fr/users/tmorris.jpg",
          lazyPicture: require("@/assets/images/tmorris-lazy.jpg"),
          login: "tmorris",
          name: "Taylor Morris",
          githubLink: "https://github.com/tmorris42",
          id: 4,
        },
        {
          picture: "https://cdn.intra.42.fr/users/tvideira.jpg",
          lazyPicture: require("@/assets/images/tvideira-lazy.jpg"),
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
