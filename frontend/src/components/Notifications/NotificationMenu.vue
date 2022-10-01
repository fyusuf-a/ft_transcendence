<template>
<!-- <v-virtual-scroll
  height="175"
  item-height="20"
  :items="this.notifications"
></v-virtual-scroll> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters } from 'vuex';
export default defineComponent({
    data() {
      return {
        notifications: this.$store.getters.notifications,
      }
    },
    methods: {
      ...mapGetters(['avatar', 'id']),
    }
})
</script>