import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import ChatWindowMenu from '@/components/Chat/ChatWindowMenu.vue';

describe('ChatWindowMenu.vue', () => {
  it('renders Leave Channel Option', () => {
    const wrapper = shallowMount(ChatWindowMenu, {});
    expect(wrapper.text()).to.include('Leave Channel');
  });
});
