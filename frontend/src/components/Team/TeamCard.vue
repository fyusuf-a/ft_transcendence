<template>
  <v-card
      class="mx-auto"
      max-width="100%"
      color="#E8EAF6"
    >  
      <v-container fluid>
        <v-row dense>
          <v-col
            v-for="teamMate in teamMates"
            :key="teamMate.login"
            :cols="teamMate.flex"
          >
            <v-card>
              <v-col align="center" class="mt-5">
                <v-avatar size="125">
                  <v-img
                    :src="teamMate.src"
                    :lazy-src="teamMate.lazy"
                  >
                  </v-img>
                </v-avatar>
              </v-col>
              <v-card-text align="center">
                <div>{{ teamMate.login }}</div>
                <div>{{ teamMate.name }}</div>
                <a :href="teamMate.githubLink" target="_blank">
                  <v-btn size="x-large" color="surface-variant" variant="text" icon="mdi-github"></v-btn>
                </a>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import abouchauImg from '@/assets/images/abouchau-lazy.jpg';
import fyusufaImg from '@/assets/images/fyusuf-a-lazy.jpg';
import mdesfontImg from '@/assets/images/mdesfont-lazy.jpg';
import tmorrisImg from '@/assets/images/tmorris-lazy.jpg';
import tvideiraImg from '@/assets/images/tvideira-lazy.jpg';

export default defineComponent({
data: () => ({
    teamMates: [
      { login: 'abouchau', name: 'Nina Bouchau', src: 'https://cdn.intra.42.fr/users/abouchau.jpg', lazy: abouchauImg, flex: 4, githubLink: 'https://github.com/N-4-Nina',},
      { login: 'fyusuf-a', name: 'Florian Yusuf Ali', src: 'https://cdn.intra.42.fr/users/fyusuf-a.jpg', lazy: fyusufaImg, flex: 4, githubLink: 'https://github.com/fyusuf-a', },
      { login: 'mdesfont', name: 'Louie Desfontaines', src: 'https://cdn.intra.42.fr/users/mdesfont.jpg', lazy: mdesfontImg, flex: 4, githubLink: 'https://github.com/Mel-louie', },
      { login: 'tmorris', name: 'Taylor Morris', src: 'https://cdn.intra.42.fr/users/tmorris.jpg', lazy: tmorrisImg, flex: 6, githubLink: 'https://github.com/tmorris42', },
      { login: 'tvideira', name: 'Théo Videira', src: 'https://cdn.intra.42.fr/users/tvideira.jpg', lazy: tvideiraImg, flex: 6, githubLink: 'https://github.com/tvideira', },
    ],
  }),
})
</script>

<style scoped>
#github {
  cursor: pointer;
  max-height: 30px;
}
</style>
