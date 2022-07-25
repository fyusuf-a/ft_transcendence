import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ChatWindow from '@/components/Chat/ChatWindow.vue';

describe('ChatWindow.vue', () => {
  it('renders channel name', () => {
    const channel = {
      id: 1,
      name: 'ChannelName',
    };
    const messages = new Map();
    const users = new Map();
    const socket = new Object();
    const wrapper = shallowMount(ChatWindow, {
      propsData: { channel, messages, users, socket },
    });
    expect(wrapper.text()).to.include(channel.name);
  });
});
