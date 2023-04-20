<template>
  <v-sheet>
    <h1 class="mb-15">ft_transcendence</h1>
    <v-progress-circular
      v-if="waiting"
      indeterminate
      class="d-block"
      :size="70"
      :width="7"
      color="primary"
    />
    <login-card
      v-if="!isTwoFAEnabled && !waiting"
      @activate-waiting="waiting = true"
    />
    <two-fa v-if="isTwoFAEnabled && !waiting" @success="goToDefault" />
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TwoFA from '@/components/Login/TwoFA.vue';
import LoginCard from '@/components/Login/LoginCard.vue';

export default defineComponent({
  components: {
    'two-fa': TwoFA,
    'login-card': LoginCard,
  },
  data() {
    return {
      isTwoFAEnabled: false,
      waiting: true,
    };
  },
  methods: {
    goToDefault() {
      this.waiting = true;
      this.$router.push('/');
    },
    goToRegister() {
      this.waiting = true;
      this.$router.push('/register');
    },
  },
  async created() {
    this.waiting = true;
    if (this.$route.query.id && this.$route.query.token) {
      try {
        const user = await this.$store.dispatch('verifyLoginInfo', {
          id: this.$route.query.id,
          token: this.$route.query.token,
          username: this.$route.query.username,
        });
        if (user.isTwoFAEnabled) {
          this.waiting = false;
          this.isTwoFAEnabled = true;
        } else {
          if (this.$route.query.username) this.goToDefault();
          else this.goToRegister();
        }
      } catch (error) {
        console.error(error);
        this.waiting = false;
      }
      return;
    } else {
      this.waiting = false;
    }
  },
});
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.v-sheet {
  margin: 3rem auto;
  width: 400px;
}

.v-progress-circular {
  margin: 0 auto;
}
</style>
