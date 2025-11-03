import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Loading from '@/components/Loading.vue';

describe('LoadingOverlay Component', () => {
  let wrapper: ReturnType<typeof mount>;

  beforeEach(() => {
    wrapper = mount(Loading);
  });

  it('deve montar sem erros e ter o nome correto', () => {
    expect(wrapper.exists()).toBe(true);
    expect(Loading.name).toBe('LoadingOverlay');
  });

  it('deve renderizar o SVG de carregamento', () => {
    const svg = wrapper.find('svg');

    expect(svg.exists()).toBe(true);

    expect(svg.classes()).toContain('animate-spin');
    expect(svg.classes()).toContain('text-primary');
  });

  it('deve ser um overlay fixo cobrindo toda a tela (z-50)', () => {
    const overlayDiv = wrapper.get('div');

    expect(overlayDiv.classes()).toContain('fixed');
    expect(overlayDiv.classes()).toContain('inset-0');
    expect(overlayDiv.classes()).toContain('bg-opacity-70');
    expect(overlayDiv.classes()).toContain('z-50');
  });

  it('deve centralizar o SVG de carregamento', () => {
    const overlayDiv = wrapper.get('div');

    expect(overlayDiv.classes()).toContain('flex');
    expect(overlayDiv.classes()).toContain('items-center');
    expect(overlayDiv.classes()).toContain('justify-center');
  });
});