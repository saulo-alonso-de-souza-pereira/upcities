// src/components/__tests__/HelpCard.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import HelpCard from '@/components/HelpCard.vue'; 

describe('HelpCard Component', () => {
    const mockProps = {
        title: 'Posso agendar para outras pessoas no meu cadastro?',
        content: 'Sim! Após escolher a data e hora do serviço, selecione a opção "Para outra pessoa", insira os dados e confirme.',
    };
    
    let wrapper: ReturnType<typeof mount>;

    beforeEach(() => {
        wrapper = mount(HelpCard, {
            props: mockProps,
            global: {
                stubs: {
                    'svg': false 
                }
            }
        });
    });

    it('deve montar sem erros e exibir o título correto', () => {

        expect(wrapper.exists()).toBe(true);
        expect(wrapper.text()).toContain(mockProps.title);
    });
    
    it('deve renderizar o conteúdo com v-html', () => {

        const contentDiv = wrapper.find('.border-t');
        expect(contentDiv.exists()).toBe(true);
        expect(contentDiv.isVisible()).toBe(false); 
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
        expect(contentDiv.isVisible()).toBe(true);

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
        
        const svg = wrapper.find('svg');
        expect(svg.classes()).toContain('rotate-180');
    });
    
    it('deve fechar o card no segundo clique', async () => {
        const button = wrapper.find('button');

        await button.trigger('click'); 
        
        await button.trigger('click'); 
        
        expect((wrapper.vm as any).isOpen).toBe(false);
        
        expect(wrapper.find('div').classes()).toContain('border-gray-border');
        expect(wrapper.find('.border-t').isVisible()).toBe(false);
    });
});