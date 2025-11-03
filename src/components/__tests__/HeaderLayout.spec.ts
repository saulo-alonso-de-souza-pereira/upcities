
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { shallowMount, type VueWrapper } from '@vue/test-utils';
import { ref } from 'vue';
import HeaderLayout from '@/components/HeaderLayout.vue';
import * as useIsMobileComposable from '@/composables/useIsMobile';
import Menu from '@/components/Menu.vue';
import MenuMobile from '@/components/MenuMobile.vue';


const isMobileMock = ref(false);


vi.mock('@/composables/useIsMobile', () => ({
  useIsMobile: () => ({
    isMobile: isMobileMock,
  }),
}));

const globalStubs = {
  Search: true,
  ChevronLeft: true,
  ChevronRight: true,
  User: true,
  Menu: true,
  MenuMobile: true,
};

describe('HeaderLayout.vue', () => {
  let wrapper: VueWrapper<any>;

  const navItemsMock = [
    { name: 'Agendar', key: 'Agendar', to: '/agendar' },
    { name: 'Meus Agendamentos', key: 'MeusAgendamentos', to: '/meus-agendamentos' },
    { name: 'Ajuda', key: 'Ajuda', to: '/ajuda' },
  ];

  beforeEach(() => {
    isMobileMock.value = false;

    wrapper = shallowMount(HeaderLayout, {
      global: {
        stubs: globalStubs,
      },
    });
  });

  it('deve renderizar o título correto', () => {
    expect(wrapper.text()).toContain('PREFEITURA DA SUA CIDADE');
  });

  it('deve renderizar o Menu (desktop) e elementos de desktop quando não for mobile', async () => {
    isMobileMock.value = false;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(Menu).exists()).toBe(true);
    expect(wrapper.findComponent(MenuMobile).exists()).toBe(false);

    expect(wrapper.text()).toContain('Entrar');
    expect(wrapper.text()).toContain('Buscar');

    expect(wrapper.find('[aria-label="Abrir Menu"]').exists()).toBe(true);
    expect(wrapper.findAll('span').filter(s => s.text() === 'Entrar').length).toBe(1);
    expect(wrapper.findAll('span').filter(s => s.text() === 'Buscar').length).toBe(1);
  });

  it('deve renderizar o MenuMobile e o botão do menu quando for mobile', async () => {
    isMobileMock.value = true;
    await wrapper.vm.$nextTick();

    expect(wrapper.findComponent(MenuMobile).exists()).toBe(true);
    expect(wrapper.findComponent(Menu).exists()).toBe(false);

    const toggleButton = wrapper.find('[aria-label="Abrir Menu"]');
    expect(toggleButton.exists()).toBe(true);


    expect(wrapper.findAll('span').filter(s => s.text() === 'Entrar').length).toBe(0);
    expect(wrapper.findAll('span').filter(s => s.text() === 'Buscar').length).toBe(0);
  });


  describe('Interações em Modo Mobile', () => {
    beforeEach(async () => {
        isMobileMock.value = true;
        await wrapper.vm.$nextTick();
    });

    it('deve iniciar com o menu fechado (isMenuOpen=false)', () => {
        expect(wrapper.vm.isMenuOpen).toBe(false);
        const chevronRight = wrapper.findComponent({ name: 'ChevronRight' });
        expect(chevronRight.exists()).toBe(true);
        const chevronLeft = wrapper.findComponent({ name: 'ChevronLeft' });
        expect(chevronLeft.exists()).toBe(false);
    });

    it('deve alternar isMenuOpen ao clicar no botão do menu e mudar o ícone', async () => {
      const toggleButton = wrapper.find('[aria-label="Abrir Menu"]');


      await toggleButton.trigger('click');
      expect(wrapper.vm.isMenuOpen).toBe(true);

      expect(wrapper.findComponent({ name: 'ChevronLeft' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ChevronRight' }).exists()).toBe(false);

      await toggleButton.trigger('click');
      expect(wrapper.vm.isMenuOpen).toBe(false);
      expect(wrapper.findComponent({ name: 'ChevronRight' }).exists()).toBe(true);
      expect(wrapper.findComponent({ name: 'ChevronLeft' }).exists()).toBe(false);
    });

    it('deve fechar o menu ao chamar setActive', async () => {

      wrapper.vm.isMenuOpen = true;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isMenuOpen).toBe(true);


      const newKey = 'Agendar';
      wrapper.vm.setActive(newKey);


      expect(wrapper.vm.activeItem).toBe(newKey);
      expect(wrapper.vm.isMenuOpen).toBe(false);
    });
  });

  describe('Interações em Modo Desktop', () => {
    beforeEach(async () => {
      isMobileMock.value = false;
      await wrapper.vm.$nextTick();
    });

    it('deve manter isMenuOpen=false, mesmo após clique, em desktop', async () => {

      const toggleButton = wrapper.find('[aria-label="Abrir Menu"]');

      await toggleButton.trigger('click');
      expect(wrapper.vm.isMenuOpen).toBe(true);
    });

    it('deve atualizar o activeItem ao chamar setActive e não fechar o menu', async () => {

      expect(wrapper.vm.isMenuOpen).toBe(false);


      const newKey = 'MeusAgendamentos';
      wrapper.vm.setActive(newKey);


      expect(wrapper.vm.activeItem).toBe(newKey);

      expect(wrapper.vm.isMenuOpen).toBe(false);
    });
  });
});