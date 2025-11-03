import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import MenuMobile from '@/components/MenuMobile.vue';


const RouterLinkStub = {
  template: '<a><slot /></a>',
  props: ['to']
};

const mockNavItems = [
  { name: 'Agendar', key: 'Agendar', to: '/agendar' },
  { name: 'Meus Agendamentos', key: 'MeusAgendamentos', to: '/meus' },
  { name: 'Ajuda', key: 'Ajuda', to: '/ajuda' },
];

describe('MenuMobile Component - Lógica', () => {
  let wrapper: VueWrapper<any>;

  const baseProps = {
    items: mockNavItems,
    activeKey: 'Ajuda',
    isOpen: false,
 };

  beforeEach(() => {
    wrapper = mount(MenuMobile, {
      props: baseProps,
      global: {
        stubs: {
          RouterLink: RouterLinkStub
        }
      }
    });
  });


  it('deve montar sem erros e renderizar o número correto de itens', () => {
    expect(wrapper.exists()).toBe(true);

    const links = wrapper.findAll('a');
    expect(links).toHaveLength(mockNavItems.length);
  });

  it('deve passar a prop "to" e o nome correto para os links', () => {
    const linkWrappers = wrapper.findAllComponents(RouterLinkStub);

    expect(linkWrappers[0].text()).toBe('Agendar');

    expect(linkWrappers[0].props().to).toBe('/agendar');
  });


  it('deve refletir o estado "isOpen" correto no prop do wrapper', async () => {
    expect(wrapper.props().isOpen).toBe(false);

    await wrapper.setProps({ isOpen: true });
    expect(wrapper.props().isOpen).toBe(true);
  });


  it('deve emitir o evento "itemClick" com a chave correta ao clicar em um item', async () => {
    const itemToClick = wrapper.findAll('a').find(a => a.text() === 'Meus Agendamentos');

    if (!itemToClick) {
        throw new Error('Link não encontrado.');
    }

    const expectedKey = 'MeusAgendamentos';

    await itemToClick.trigger('click');


    expect(wrapper.emitted()).toHaveProperty('itemClick');

    expect(wrapper.emitted('itemClick')![0][0]).toBe(expectedKey);
  });

  it('deve emitir o evento itemClick mesmo para o item ativo', async () => {

    const itemToClick = wrapper.findAll('a').find(a => a.text() === 'Ajuda');

    if (!itemToClick) {
        throw new Error('Link não encontrado.');
    }

    const expectedKey = 'Ajuda';

    await itemToClick.trigger('click');

    expect(wrapper.emitted('itemClick')![0][0]).toBe(expectedKey);
  });
});