import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import ChatMessageMenu from "@/components/Chat/ChatMessageMenu.vue";

describe("ChatMessageMenu.vue", () => {
  it("renders props", () => {
    const targetId = 1;
    const wrapper = shallowMount(ChatMessageMenu, {
      propsData: { targetId },
    });
    expect(wrapper.text()).to.include("Profile");
    expect(wrapper.text()).to.include("Challenge");
  });
});
