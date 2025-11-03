<template>
  <footer class="bg-white border-t border-gray-divider mt-6">
    <div class="w-full bg-primary-light py-6 desktop:py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col desktop:flex-row items-center justify-between">
        <span class="text-black font-montserrat text-lg desktop:text-xl font-semibold mb-4 desktop:mb-0">
          Experimente o aplicativo de "Cidade"!!
        </span>
        <div class="flex space-x-4">
          <a
            :href="urlAppStore"
            aria-label="Baixar na App Store"
          >
            <img
              :src="pathImgAppStore"
              alt="App Store"
              class="h-10 rounded-md"
            />
          </a>
          <a 
            :href="urlPlayStore"
            aria-label="Disponível no Google Play"
          >
            <img
              :src="pathImgPlayStore"
              alt="Google Play"
              class="h-10 rounded-md"
            />
          </a>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto flex flex-col desktop:flex-row justify-between items-center desktop:items-start mt-6">
    </div>
    <div class="text-center text-xs text-gray-search mt-6">
      Um produto <span class="text-blue font-semibold">UpCities</span>
    </div>
  </footer>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import playStoreImage from '@/assets/play-store.png';
import appStoreImage from '@/assets/app-store.png';

export default defineComponent({
  name: 'FooterLayout',
  setup() {
    const pathImgPlayStore = ref(playStoreImage);
    const pathImgAppStore = ref(appStoreImage);
    const urlPlayStore = ref('https://play.google.com/');
    const urlAppStore = ref('https://www.apple.com/br/app-store/');

    return {
      pathImgPlayStore,
      pathImgAppStore,
      urlPlayStore,
      urlAppStore,
    };
  }
});
</script>