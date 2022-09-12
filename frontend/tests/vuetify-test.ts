import { shallowMount, mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
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

export function myMount(component: any, options: Record<string, unknown> = {}) {
  return mount(component, {
    global: {
      plugins: [vuetify],
    },
    vuetify,
    ...options,
  });
}
