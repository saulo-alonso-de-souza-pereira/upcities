import { describe, it, expect, beforeEach } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import HelpCard from '@/components/HelpCard.vue';

const MockChevronDown = {
  template: '<svg data-testid="chevron-icon"></svg>',
};

describe('HelpCard Component', () => {
  const mockProps = {
    title: 'Posso agendar para outras pessoas no meu cadastro?',
    content: 'Sim! Após escolher a data e hora do serviço, selecione a opção "Para outra pessoa", insira os dados e confirme.',
  };

  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = mount(HelpCard, {
      props: mockProps,
      global: {
        stubs: {
          ChevronDown: MockChevronDown
        }
      }
    });
  });

  it('deve montar sem erros e exibir o título correto', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.text()).toContain(mockProps.title);
  });

  it('deve renderizar o conteúdo mas mantê-lo oculto', () => {
    const contentDiv = wrapper.find('.border-t');
    expect(contentDiv.exists()).toBe(true);
    expect(contentDiv.attributes('style')).toContain('display: none;');
    expect(wrapper.html()).toContain(mockProps.content);
  });

  it('deve estar fechado e com o estilo padrão ao montar', () => {
    const mainDiv = wrapper.find('div');
    const button = wrapper.find('button');

    expect((wrapper.vm as any).isOpen).toBe(false);

    expect(mainDiv.classes()).toContain('border-gray-border');
    expect(mainDiv.classes()).not.toContain('border-primary');

    expect(button.attributes('aria-expanded')).toBe('false');
  });

  it('deve abrir o card e mudar o estado ao clicar no botão', async () => {
    const button = wrapper.find('button');

    await button.trigger('click');

    expect((wrapper.vm as any).isOpen).toBe(true);

    const contentDiv = wrapper.find('.border-t');
    expect(contentDiv.attributes('style')).not.toContain('display: none;');

    expect(button.attributes('aria-expanded')).toBe('true');
  });

  it('deve ter o estilo ativo quando o estado for aberto', async () => {
    const button = wrapper.find('button');
    const mainDiv = wrapper.find('div');
    const titleSpan = wrapper.find('span');

    await button.trigger('click');

    expect(mainDiv.classes()).toContain('border-primary');
    expect(mainDiv.classes()).not.toContain('border-gray-border');

    expect(titleSpan.classes()).toContain('font-semibold');

    const icon = wrapper.find('[data-testid="chevron-icon"]');
    expect(icon.classes()).toContain('rotate-180');
    expect(icon.classes()).toContain('text-primary');
  });

  it('deve fechar o card no segundo clique', async () => {
    const button = wrapper.find('button');

    await button.trigger('click');

    await button.trigger('click');

    expect((wrapper.vm as any).isOpen).toBe(false);

    expect(wrapper.find('div').classes()).toContain('border-gray-border');
    expect(wrapper.find('.border-t').attributes('style')).toContain('display: none;');
  });
});