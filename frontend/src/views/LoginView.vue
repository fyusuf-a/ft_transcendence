<template>
  <component :is="loginComponent" />
</template>

<script lang="ts">
import { defineComponent, defineAsyncComponent, Component } from 'vue';

export default defineComponent({
  computed: {
    loginComponent() {
      return defineAsyncComponent(() => {
        let component: Promise<Component> = import(
          `@/components/Login/${
            import.meta.env.VITE_DISABLE_AUTHENTICATION === 'true'
              ? 'NoAuth'
              : 'FortyTwo'
          }.vue`
        );
        return component;
      });
    },
  },
});
</script>
