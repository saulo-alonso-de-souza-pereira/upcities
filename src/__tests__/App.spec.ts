import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import App from '@/App.vue';

const mockFaqStore = {
  isLoading: ref(false),
};

vi.mock('@/stores/Faq', () => ({
  useFaqStore: vi.fn(() => mockFaqStore),
}));


describe('App.vue', () => {
  const globalMocks = {
    stubs: {
      HeaderLayout: true,
      FooterLayout: true,
      Loading: true,
      RouterView: true,
    },
  };

  beforeEach(() => {
    mockFaqStore.isLoading.value = false;
  });

  it('renders HeaderLayout and FooterLayout always', () => {
    const wrapper = mount(App, { global: globalMocks });

    expect(wrapper.findComponent({ name: 'HeaderLayout' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'FooterLayout' }).exists()).toBe(true);
  });

});
