
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useIsMobile } from '@/composables/useIsMobile'; 
import type { an } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js';


const originalInnerWidth = window.innerWidth;

const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;


function setWindowSize(width) {
  
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  
  window.dispatchEvent(new Event('resize'));
}


const TestComponent = defineComponent({
  setup() {
    return useIsMobile();
  },
  render() {
    
    return h('div', { 'data-mobile': this.isMobile });
  },
});

describe('useIsMobile', () => {
  let addListenerSpy: any;
  let removeListenerSpy: any;

  beforeEach(() => {
    
    setWindowSize(originalInnerWidth);

    addListenerSpy = vi.spyOn(window, 'addEventListener');
    removeListenerSpy = vi.spyOn(window, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });
  
  it('deve retornar { isMobile } como uma ref', () => {
    const result = useIsMobile();
    expect(result).toHaveProperty('isMobile');
    expect(result.isMobile.value).toBe(false);
  });

  it('deve ser false (desktop) quando window.innerWidth for 1024 ou maior na montagem', () => {
    setWindowSize(1024); 
    const wrapper = mount(TestComponent);
    
    expect(wrapper.vm.isMobile).toBe(false);
    
    wrapper.unmount();
  });
  
  it('deve ser true (mobile) quando window.innerWidth for menor que 1024 na montagem', () => {
    setWindowSize(1023);
    
    const wrapper = mount(TestComponent);
    
    expect(wrapper.vm.isMobile).toBe(true);
    
    wrapper.unmount();
  });
  
  it('deve adicionar o listener de "resize" ao window no onMounted', () => {
    const wrapper = mount(TestComponent);
    
    expect(addListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    wrapper.unmount();
  });

  it('deve remover o listener de "resize" do window no onUnmounted', () => {
    const wrapper = mount(TestComponent);
    const resizeHandler = addListenerSpy.mock.calls.find(call => call[0] === 'resize')[1];
    
    wrapper.unmount();
    
    expect(removeListenerSpy).toHaveBeenCalledWith('resize', resizeHandler);
  });

  it('deve atualizar isMobile para true em um evento "resize" (de desktop para mobile)', async () => {
    setWindowSize(1200); 
    const wrapper = mount(TestComponent);
    expect(wrapper.vm.isMobile).toBe(false);
    
    setWindowSize(500);
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.isMobile).toBe(true);
    
    wrapper.unmount();
  });

  it('deve atualizar isMobile para false em um evento "resize" (de mobile para desktop)', async () => {
    setWindowSize(600);
    const wrapper = mount(TestComponent);
    expect(wrapper.vm.isMobile).toBe(true);
    
    setWindowSize(1024);
    await wrapper.vm.$nextTick();
    
    expect(wrapper.vm.isMobile).toBe(false);
    
    wrapper.unmount();
  });
});