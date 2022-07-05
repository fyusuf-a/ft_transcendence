import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import MessageItem from "@/components/Chat/MessageItem.vue";

describe("MessageItem.vue", () => {
  it("renders props", () => {
    const props = {
      sender: "SenderName",
      senderId: 1,
      createdAt: "2022-07-04",
      content: "This is the message",
    };
    const wrapper = shallowMount(MessageItem, {
      propsData: props,
    });
    expect(wrapper.text()).to.include(props.sender);
    expect(wrapper.text()).to.include(props.content);
  });
});
