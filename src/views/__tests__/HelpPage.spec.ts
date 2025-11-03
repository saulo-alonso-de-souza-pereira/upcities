import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';

import { useFaqStore } from '@/stores/Faq';
import { useIsMobile } from '@/composables/useIsMobile';
import HelpPage from '@/views/HelpPage.vue';

vi.mock('@/composables/useIsMobile', () => ({
  useIsMobile: vi.fn(),
}));
const mockedUseIsMobile = vi.mocked(useIsMobile);

const stubs = {
  HelpCard: {
    template: '<div class="mock-help-card">{{ title }}</div>',
    props: ['title', 'content'],
  },
  Undo2: { template: '<svg data-testid="undo-icon"></svg>' },
  Search: { template: '<svg data-testid="search-icon"></svg>' },
  CircleX: { template: '<svg data-testid="clear-icon-input"></svg>' },
  CircleQuestionMark: { template: '<svg data-testid="title-icon"></svg>' },
};

const mockCards = [
  { ticket: { description: 'Como resetar a senha' }, answer: 'Instruções para senha.' },
  { ticket: { description: 'Onde vejo meu extrato' }, answer: 'Instruções para extrato.' },
  { ticket: { description: 'Falar com atendente' }, answer: 'Instruções para atendente.' },
];


let scrollCallback: () => void = () => { };

describe('HelpPage.vue', () => {
  let pinia: any;

  const setScrollY = (value: number) => {

    window.scrollY = value;

    if (scrollCallback) {
      scrollCallback();
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    pinia = createPinia();
    setActivePinia(pinia);

    vi.stubGlobal('scrollY', 0);


    vi.spyOn(window, 'scrollTo').mockImplementation(() => { });


    vi.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      if (event === 'scroll') {
        scrollCallback = cb as () => void;
      }
    });

    vi.spyOn(window, 'removeEventListener');


    setScrollY(0);
    vi.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mountComponent = (
    isMobileValue: boolean,
    initialCards: any[] = []
  ): { wrapper: VueWrapper<any>; faqStore: any } => {

    mockedUseIsMobile.mockReturnValue({ isMobile: ref(isMobileValue) });

    const faqStore = useFaqStore();
    faqStore.cards = initialCards;
    vi.spyOn(faqStore, 'fetchFaqData');

    const wrapper = mount(HelpPage, {
      global: {
        plugins: [pinia],
        stubs,
      },
    });

    return { wrapper, faqStore };
  };

  it('deve renderizar o estado inicial e chamar fetchFaqData se a store estiver vazia', () => {
    const { wrapper, faqStore } = mountComponent(false, []);
    expect(wrapper.find('h1').text()).toContain('Ajuda');
    expect(wrapper.find('p').text()).toContain('Como podemos te ajudar hoje?');
    expect(wrapper.findAll('.mock-help-card').length).toBe(0);
    expect(faqStore.fetchFaqData).toHaveBeenCalledTimes(1);
  });

  it('deve renderizar todos os cards e NÃO chamar fetchFaqData se a store tiver dados', () => {
    const { wrapper, faqStore } = mountComponent(false, mockCards);

    expect(wrapper.findAll('.mock-help-card').length).toBe(mockCards.length);

    expect(wrapper.find('p.text-lg.font-semibold').exists()).toBe(false);

    expect(faqStore.fetchFaqData).not.toHaveBeenCalled();
  });

  it('deve aplicar classes de mobile (text-xl) quando isMobile for true', () => {
    const { wrapper } = mountComponent(true, []);
    expect(wrapper.find('h1').classes()).toContain('text-xl');
  });

  it('deve aplicar classes de desktop (text-28px) quando isMobile for false', () => {
    const { wrapper } = mountComponent(false, []);
    expect(wrapper.find('h1').classes()).toContain('text-28px');
  });

  it('deve filtrar os cards com base no searchTerm', async () => {
    const { wrapper } = mountComponent(false, mockCards);
    const input = wrapper.find('input[type="text"]');
    await input.setValue('senha');
    expect(wrapper.find('div.mb-6').text()).toContain('Resultados encontrados para: senha');
    expect(wrapper.find('[data-testid="clear-icon-input"]').exists()).toBe(true);
    const cards = wrapper.findAll('.mock-help-card');
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Como resetar a senha');
  });

  it('deve mostrar a mensagem de "nenhum resultado" se a busca não retornar nada', async () => {
    const { wrapper } = mountComponent(false, mockCards);
    const input = wrapper.find('input[type="text"]');
    await input.setValue('termo_inexistente');
    expect(wrapper.find('div.mb-6').text()).toContain('termo_inexistente');
    expect(wrapper.findAll('.mock-help-card').length).toBe(0);
    expect(wrapper.find('p').text()).toContain('Não foram encontrados resultados');
    expect(wrapper.find('[data-testid="undo-icon"]').exists()).toBe(true);
  });

  it('deve limpar a busca ao clicar no ícone (CircleX) do input', async () => {
    const { wrapper } = mountComponent(false, mockCards);
    const input = wrapper.find('input[type="text"]');
    await input.setValue('senha');
    expect(wrapper.findAll('.mock-help-card').length).toBe(1);
    await wrapper.find('[data-testid="clear-icon-input"]').trigger('click');
    expect(input.element.value).toBe('');
    expect(wrapper.findAll('.mock-help-card').length).toBe(mockCards.length);
    expect(wrapper.find('div.mb-6').exists()).toBe(false);
  });

  it('deve limpar a busca ao clicar no botão (Undo2) da tela de "nenhum resultado"', async () => {
    const { wrapper } = mountComponent(false, mockCards);
    const input = wrapper.find('input[type="text"]');
    await input.setValue('termo_inexistente');
    expect(wrapper.findAll('.mock-help-card').length).toBe(0);
    await wrapper.find('button.flex.items-center').trigger('click');
    expect(input.element.value).toBe('');
    expect(wrapper.findAll('.mock-help-card').length).toBe(mockCards.length);
  });

  it('deve mostrar o botão "Voltar ao topo" apenas após scrollar > 300px', async () => {
    const { wrapper } = mountComponent(false, []);
    const scrollToTopButton = wrapper.find('button[aria-label="Voltar ao topo"]');

    expect(scrollToTopButton.attributes('style')).toContain('display: none;');

    setScrollY(200);
    await wrapper.vm.$nextTick();

    expect(scrollToTopButton.attributes('style')).toContain('display: none;');

    setScrollY(301);
    await wrapper.vm.$nextTick();

    expect(scrollToTopButton.attributes('style')).not.toContain('display: none;');

    setScrollY(100);
    await wrapper.vm.$nextTick();

    expect(scrollToTopButton.attributes('style')).toContain('display: none;');
  });

  it('deve chamar window.scrollTo ao clicar no botão "Voltar ao topo"', async () => {
    const { wrapper } = mountComponent(false, []);
    const scrollToTopButton = wrapper.find('button[aria-label="Voltar ao topo"]');

    setScrollY(301);
    await wrapper.vm.$nextTick();

    expect(scrollToTopButton.isVisible()).toBe(true);

    await scrollToTopButton.trigger('click');

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('deve remover o event listener de scroll no onUnmounted', () => {
    const { wrapper } = mountComponent(false, []);

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', scrollCallback);

    wrapper.unmount();

    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', scrollCallback);
  });
});