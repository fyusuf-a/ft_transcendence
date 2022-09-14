<template>
  <v-card class="pa-2 ml-15 mt-5" width="40%">
    <v-card-title>
      <v-icon>mdi-shield-key</v-icon>
      <span class="ml-2">Two-factor authentication</span>
    </v-card-title>
    <v-card-text>
      <v-switch
        :label="labelForSwitch"
        :modelValue="isTwoFAEnabled"
        @update:modelValue="updateIsTwoFAEnabled"
        color="primary"
        :disabled="isSwitchDisabled"
      />
      <v-row v-if="isSwitchDisabled">
        <v-col>
          <v-img :src="qrCode" max-width="15em" />
        </v-col>
        <v-col>
          <two-fa
            @success="toggleSwitchActivation()"
            class="flex-grow-1 mt-5"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { ResponseUserDto } from '@dtos/users';
import { toDataURL } from 'qrcode';
import TwoFA from '@/components/Login/TwoFA.vue';

export default defineComponent({
  components: {
    'two-fa': TwoFA,
  },
  emits: ['error'],
  async created() {
    try {
      let response = await axios.get<ResponseUserDto>('/users/me');
      this.isTwoFAEnabled = response.data.isTwoFAEnabled;
    } catch (e) {
      this.$emit('error', e);
    }
  },
  data() {
    return {
      isTwoFAEnabled: false,
      qrCode: '',
      isSwitchDisabled: false,
      twoFACode: '',
    };
  },
  methods: {
    async deactivateTwoFA() {
      try {
        axios.get('/auth/2fa/deactivate');
      } catch (e) {
        console.error(`Could not deactivate 2fa: ${e}`);
        this.isTwoFAEnabled = true;
      } finally {
        this.toggleSwitchActivation();
      }
    },
    async getQRCode() {
      try {
        const response = await axios.post('/auth/2fa/generate');
        this.qrCode = await toDataURL(response.data);
      } catch (e) {
        console.error(`Could not download QR code : ${e}`);
        this.isTwoFAEnabled = false;
        this.toggleSwitchActivation();
      }
    },
    async updateIsTwoFAEnabled(value: boolean) {
      this.toggleSwitchActivation();
      if (value === false) {
        this.isTwoFAEnabled = false;
        await this.deactivateTwoFA();
      } else {
        this.isTwoFAEnabled = true;
        await this.getQRCode();
      }
    },
    toggleSwitchActivation() {
      this.isSwitchDisabled = !this.isSwitchDisabled;
    },
  },
  computed: {
    labelForSwitch(): string {
      if (!(this.isSwitchDisabled && this.isTwoFAEnabled)) return '';
      return 'Scan the following QR code with Google authenticator';
    },
  },
});
</script>
