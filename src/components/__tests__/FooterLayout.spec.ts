import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, VueWrapper } from '@vue/test-utils';
import FooterLayout from '@/components/FooterLayout.vue';

vi.mock('@/assets/play-store.png', () => ({ default: 'mock-play-store-url' }));
vi.mock('@/assets/app-store.png', () => ({ default: 'mock-app-store-url' }));

describe('FooterLayout Component', () => {
    
    let wrapper: VueWrapper<any>;
    const expectedPlayStoreUrl = 'https://play.google.com/';
    const expectedAppStoreUrl = 'https://www.apple.com/br/app-store/';

    beforeEach(() => {
        wrapper = mount(FooterLayout);
    });

    it('1. Deve montar o componente sem erros', () => {
        expect(wrapper.exists()).toBe(true);
    });

    it('2. A propriedade "name" do componente deve ser igual a "FooterLayout"', () => {
        expect(FooterLayout.name).toEqual('FooterLayout');
    });

    it('3. Deve renderizar a mensagem de chamada principal', () => {
        const span = wrapper.find('span.font-semibold');
        expect(span.text()).toContain('Experimente o aplicativo de "Cidade"!!');
    });
    
    it('4. O link da App Store deve ter o href e o alt corretos', () => {

        const appStoreLink = wrapper.find('a[aria-label="Baixar na App Store"]');
        const img = appStoreLink.find('img');

        expect(appStoreLink.attributes('href')).toBe(expectedAppStoreUrl);

        expect(img.attributes('alt')).toBe('App Store');
        expect(img.attributes('src')).toBe('mock-app-store-url');
    });

    it('5. O link do Google Play deve ter o href e o alt corretos', () => {
        
        const playStoreLink = wrapper.find('a[aria-label="Disponível no Google Play"]');
        const img = playStoreLink.find('img');

        expect(playStoreLink.attributes('href')).toBe(expectedPlayStoreUrl);


        expect(img.attributes('alt')).toBe('Google Play');
        expect(img.attributes('src')).toBe('mock-play-store-url');
    });

    it('6. Deve renderizar a assinatura "Um produto UpCities"', () => {
        expect(wrapper.text()).toContain('Um produto UpCities');
        expect(wrapper.find('span.text-blue').text()).toBe('UpCities');
    });
});