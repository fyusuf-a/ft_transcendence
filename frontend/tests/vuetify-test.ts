import { shallowMount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import { Component } from 'vue';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

const vuetify = createVuetify({ components, directives });

export function myShallowMount(
  component: any,
  options: Record<string, unknown> = {},
) {
  return shallowMount(component, {
    global: {
      plugins: [vuetify],
    },
    vuetify,
    ...options,
  });
}
