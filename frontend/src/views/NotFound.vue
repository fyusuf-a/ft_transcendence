<template>
  <v-container>
    <div class="content">
      <h1>Uh oh. Error 404: Page Not Found</h1>
      <br />
      <p>
        We are really sorry, but the page you're looking for doesn't seem to
        exist. <br />Do you want to return to your
        <router-link to="/profile">profile page</router-link> or
        <router-link to="/game">play a match</router-link>? <br />Anyway, it's
        dangerous to go alone, take a cute little cat with you.
      </p>
      <div class="posImg">
        <v-img
          :src="errorImg"
          max-width="50em"
        >
        </v-img>
      </div>
      <p class="imgSrc">
        <a
          href="https://pixabay.com/fr/photos/cat-animal-de-compagnie-animal-98359/"
          target="_blank"
        >
          image source
        </a>
      </p>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import errorImg from '@/assets/images/error-404.jpg';

export default defineComponent({
data: () => ({
      errorImg,
  }),
})
</script>

<style scoped>
.content {
  padding: 4em 0 0 0;
}

.imgSrc {
  text-align: right;
  margin-top: 10px;
  color: black;
}

a {
  text-decoration: none;
  color: black;
}

a:visited {}

a:hover {
  background: #03DAC6;
  color: white;
  border-radius: 5px;
  padding: 1px 3px 1px 3px;
}

.posImg {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  margin-top: 50px;
}
</style>
