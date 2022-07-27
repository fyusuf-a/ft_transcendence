<template>
  <v-container>
    <div class="content">
      <h1>Uh oh. Error 404: Page Not Found</h1>
      <br>
      <p>We are really sorry, but the page you're looking for doesn't seem to exist.
      <br>Do you want to return to your <router-link to="/profile">profile page</router-link> or <router-link to="/game">play a match</router-link>?
      <br>Anyway, it's dangerous to go alone, take a cute little cat with you.</p>
      <v-card
	  		outlined color="transparent"
	  		:loading="loading"
	  		class="mx-auto my-12"
	  	>
	  		<v-img :src="errorPicture"></v-img>
	  	</v-card>
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
export default {
  data () {
    return {
      errorPicture: require('@/assets/images/40cat.png')
    };
  }

}
</script>

<style scoped>
.content {
  padding: 4em 0 0 0;
}

.imgSrc {
	text-align: right;
	padding-top: 75px;
	color: black;
}

a {
  text-decoration: none;
}

a:visited {
  /* color: black; */
}

a:hover {
  background: teal;
  color: white;
  border-radius: 5px;
  padding: 1px 3px 1px 3px;
}
</style>
