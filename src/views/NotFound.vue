<template>
  <div class="min-h-screen bg-background-page pt-16 font-montserrat">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 desktop:py-12">
      <h1 class="flex items-center text-black font-bold mb-6 desktop:mb-8"
        :class="{'text-xl': isMobile, 'text-2xl desktop:text-3xl': !isMobile}">
        
        <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-2">
          <CircleAlert class="text-red-500"/>
        </div>
        Página Não Encontrada
      </h1>
    </div>
  </div>
</template>

<script lang="ts">
import { CircleAlert } from 'lucide-vue-next';
import { defineComponent } from 'vue';
import { useIsMobile } from '../composables/useIsMobile';


export default defineComponent({
  name: 'NotFound',
  components: {
    CircleAlert,
  },

  setup() {

    const { isMobile } = useIsMobile();


    return {
      isMobile,
    };
  },
});

</script>