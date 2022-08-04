import { myShallowMount } from '@tests/vuetify-test';
import App from '@/App.vue';

describe('App.vue', () => {
  it('should mount', () => {
    const wrapper = myShallowMount(App, {});
    expect(wrapper.text()).to.equal('');
  });
});
