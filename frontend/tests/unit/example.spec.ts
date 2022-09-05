import { myMount } from '@tests/vuetify-test';
import App from '@/App.vue';

describe('App.vue', () => {
  it('should mount', () => {
    const wrapper = myMount(App, {});
    expect(wrapper.text()).to.equal('');
  });
});
