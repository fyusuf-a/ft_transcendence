<template>
  <div>
    Please enter your 6-digit code to complete the login process
    <v-text-field
      label="6-digit code"
      placeholder="420042"
      v-model="twoFACode"
      @input="verifyCode"
      :rules="[(v) => v.length <= 6 || 'Code must be 6 digit-long']"
      :error-messages="errors"
      prepend-inner-icon="mdi-google"
      v-if="!alertShown"
    />
    <v-alert type="success" v-else> Success </v-alert>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      twoFACode: '',
      alertShown: false,
      errors: [] as string[],
    };
  },
  emits: ['success'],
  methods: {
    async verifyCode() {
      this.errors.pop();
      if (!(this.twoFACode.length === 6)) return;
      try {
        await this.$store.dispatch('verify2FA', { code: this.twoFACode });
        this.alertShown = true;
        setTimeout(() => {
          this.$emit('success');
        }, 1500);
      } catch (e) {
        this.errors.push('Invalid code');
      }
    },
  },
});
</script>
