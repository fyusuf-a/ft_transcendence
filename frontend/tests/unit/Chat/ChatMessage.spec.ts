import MessageItem from '@/components/Chat/ChatMessage.vue';
import { myShallowMount } from '@tests/vuetify-test';

describe('MessageItem.vue', () => {
  it('renders props', () => {
    const props = {
      sender: 'SenderName',
      senderId: 1,
      createdAt: '2022-07-04',
      content: 'This is the message',
    };
    const wrapper = myShallowMount(MessageItem, {
      propsData: props,
    });
    expect(wrapper.text()).to.include(props.sender);
    expect(wrapper.text()).to.include(props.content);
  });
});
