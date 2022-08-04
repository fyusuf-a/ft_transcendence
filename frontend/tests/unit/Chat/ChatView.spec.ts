import { myShallowMount } from '@tests/vuetify-test';
import ChatView from '@/views/ChatView.vue';

describe('ChatView.vue', () => {
  it('renders props', async () => {
    const wrapper = myShallowMount(ChatView, {});
    expect(wrapper).to.exist;
  });
});
