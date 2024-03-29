import { myMount } from '@tests/vuetify-test';
import ChatWindowMenu from '@/components/Chat/ChatWindowMenu.vue';

describe('ChatWindowMenu.vue', () => {
  it('renders Leave Channel Option', () => {
    const wrapper = myMount(ChatWindowMenu, {});
    expect(wrapper.text()).to.include('Leave Channel');
  });
});
