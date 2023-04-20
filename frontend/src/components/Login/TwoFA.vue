<template>
  <div>
    <div class="mb-4">
      Please enter your Google Authenticator 6-digit code to complete the login process
    </div>
    <v-text-field
      label="6-digit code"
      placeholder="420042"
      v-model="twoFACode"
      @input="verifyCode"
      :rules="[(v) => v.length <= 6 || 'Code must be 6 digit-long']"
      :error-messages="errors"
      prepend-inner-icon="mdi-google"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  data() {
    return {
      twoFACode: '',
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
        this.$emit('success');
      } catch (e) {
        this.errors.push('Invalid code');
      }
    },
  },
});
</script>
