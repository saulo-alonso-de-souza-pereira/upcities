import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { ref } from 'vue';

import { useIsMobile } from '@/composables/useIsMobile';

import NotFound from '@/views/NotFound.vue';

vi.mock('@/composables/useIsMobile', () => ({
  useIsMobile: vi.fn(),
}));

const MockCircleAlert = {
  template: '<svg data-testid="alert-icon"></svg>',
};

const mockedUseIsMobile = vi.mocked(useIsMobile);

describe('NotFound.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mountComponent = (isMobileValue: boolean): VueWrapper<any> => {
    
    mockedUseIsMobile.mockReturnValue({ isMobile: ref(isMobileValue) });


    const wrapper = mount(NotFound, {
      global: {
        stubs: {
          CircleAlert: MockCircleAlert,
        },
      },
    });

    return wrapper;
  };

  it('deve renderizar o título principal "Página Não Encontrada" e o ícone', () => {

    const wrapper = mountComponent(false);

    const h1 = wrapper.find('h1');
    expect(h1.text()).toContain('Página Não Encontrada');
    expect(wrapper.find('[data-testid="alert-icon"]').exists()).toBe(true);
  });

  it('deve aplicar as classes de mobile (text-xl) quando isMobile for true', () => {

    const wrapper = mountComponent(true);

    const h1 = wrapper.find('h1');
    expect(h1.classes()).toContain('text-xl');
    expect(h1.classes()).not.toContain('text-2xl');
    expect(h1.classes()).not.toContain('desktop:text-3xl');
  });

  it('deve aplicar as classes de desktop (text-2xl desktop:text-3xl) quando isMobile for false', () => {

    const wrapper = mountComponent(false);

    const h1 = wrapper.find('h1');
    expect(h1.classes()).not.toContain('text-xl');
    expect(h1.classes()).toContain('text-2xl');
    expect(h1.classes()).toContain('desktop:text-3xl');
  });
});