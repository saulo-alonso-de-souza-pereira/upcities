import { describe, it, expect, vi } from 'vitest';
import { mount, RouterLinkStub } from '@vue/test-utils';
import Menu from '@/components/Menu.vue';


const mockRoute = {
  path: '/home',
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));


const mockItems = [
  { name: 'Início', key: 'home', to: '/home' },
  { name: 'Sobre', key: 'about', to: '/about' },
  { name: 'Contato', key: 'contact', to: '/contact' },
];

describe('Menu.vue', () => {

  const mountMenu = (props = {}) => {
    return mount(Menu, {
      props: {
        items: mockItems,
        ...props,
      },

      global: {
        stubs: {
          RouterLink: RouterLinkStub,
        },
      },
    });
  };


  it('deve renderizar a lista de itens do menu', () => {
    const wrapper = mountMenu();
    

    const links = wrapper.findAllComponents(RouterLinkStub);
    
    expect(links).toHaveLength(mockItems.length);
    

    mockItems.forEach((item, index) => {
      const link = links[index];
      expect(link.text()).toBe(item.name);

      expect(link.props().to).toBe(item.to); 
    });
  });


  it('deve aplicar a classe nav-active ao item ativo', () => {

    mockRoute.path = '/home';
    const wrapper = mountMenu();

    const links = wrapper.findAllComponents(RouterLinkStub);
    

    expect(links[0].classes()).toContain('nav-active');
    

    expect(links[1].classes()).not.toContain('nav-active');
    expect(links[2].classes()).not.toContain('nav-active');
  });

  it('não deve aplicar a classe nav-active se a rota não corresponder', () => {

    mockRoute.path = '/blog'; 
    const wrapper = mountMenu();

    const links = wrapper.findAllComponents(RouterLinkStub);


    links.forEach(link => {
      expect(link.classes()).not.toContain('nav-active');
    });
  });


  it('deve emitir o evento "itemClick" com a chave do item ao clicar', async () => {
    const wrapper = mountMenu();
    
    const aboutLink = wrapper.findAllComponents(RouterLinkStub)[1];
    
    await aboutLink.trigger('click');
    
    expect(wrapper.emitted('itemClick')).toBeTruthy();
    
    const emittedEvent = wrapper.emitted('itemClick');
    expect(emittedEvent).toHaveLength(1);
    expect(emittedEvent![0]).toEqual(['about']);
  });

  it('deve ter o prop isOpen com valor default como false', () => {
    const wrapper = mountMenu();
    expect(wrapper.props('isOpen')).toBe(false);
  });
  
  it('deve aceitar o prop isOpen como true', () => {
    const wrapper = mountMenu({ isOpen: true });
    expect(wrapper.props('isOpen')).toBe(true);
  });

});