import { myMount } from '@tests/vuetify-test';
import ChatView from '@/views/ChatView.vue';

describe('ChatView.vue', () => {
  it('renders props', async () => {
    const wrapper = myMount(ChatView, {});
    expect(wrapper).to.exist;
  });
});
