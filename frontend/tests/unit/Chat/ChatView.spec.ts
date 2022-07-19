import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ChatView from '@/views/ChatView.vue';

describe('ChatView.vue', () => {
  it('renders props', async () => {
    const wrapper = shallowMount(ChatView, {});
    expect(wrapper).to.exist;
  });
});
