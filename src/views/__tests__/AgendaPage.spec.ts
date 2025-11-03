import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';

import { useFaqStore } from '@/stores/Faq';
import { useIsMobile } from '@/composables/useIsMobile';

import AgendaPage from '@/views/AgendaPage.vue';

vi.mock('@/composables/useIsMobile', () => ({
  useIsMobile: vi.fn(),
}));

const MockCalendarClock = {
  template: '<svg data-testid="calendar-clock-icon"></svg>',
};

const mockedUseIsMobile = vi.mocked(useIsMobile);


describe('AgendaPage.vue', () => {
  let pinia: any;

  beforeEach(() => {
    vi.clearAllMocks();

    pinia = createPinia();
    setActivePinia(pinia);

    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  const mountComponent = (
    isMobileValue: boolean,
    initialCards: any[] = []
  ): { wrapper: VueWrapper<any>; faqStore: any } => {
    
    mockedUseIsMobile.mockReturnValue({ isMobile: ref(isMobileValue) });

    const faqStore = useFaqStore();
    
    faqStore.cards = initialCards;
    
    vi.spyOn(faqStore, 'fetchFaqData');

    const wrapper = mount(AgendaPage, {
      global: {

        plugins: [pinia],

        stubs: {
          CalendarClock: MockCalendarClock,
        },
      },
    });

    return { wrapper, faqStore };
  };

  it('deve renderizar o título principal "Agendar" e o ícone', () => {

    const { wrapper } = mountComponent(false);

    const h1 = wrapper.find('h1');
    expect(h1.text()).toContain('Agendar');
    expect(wrapper.find('[data-testid="calendar-clock-icon"]').exists()).toBe(true);
  });


  it('deve aplicar as classes de mobile (text-xl) quando isMobile for true', () => {

    const { wrapper } = mountComponent(true);

    const h1 = wrapper.find('h1');
    expect(h1.classes()).toContain('text-xl');
    expect(h1.classes()).not.toContain('text-2xl');
    expect(h1.classes()).not.toContain('desktop:text-3xl');
  });

  it('deve aplicar as classes de desktop (text-2xl desktop:text-3xl) quando isMobile for false', () => {

    const { wrapper } = mountComponent(false);

    const h1 = wrapper.find('h1');
    expect(h1.classes()).not.toContain('text-xl');
    expect(h1.classes()).toContain('text-2xl');
    expect(h1.classes()).toContain('desktop:text-3xl');
  });

  it('deve chamar fetchFaqData no onMounted se a store de cards estiver vazia', () => {

    const { faqStore } = mountComponent(false, []);

    expect(faqStore.fetchFaqData).toHaveBeenCalledTimes(1);
  });


  it('NÃO deve chamar fetchFaqData no onMounted se a store de cards já tiver dados', () => {

    const mockCards = [{ id: 1, question: 'Teste', answer: 'Resposta' }];
    const { faqStore } = mountComponent(false, mockCards);


    expect(faqStore.fetchFaqData).not.toHaveBeenCalled();
  });
});