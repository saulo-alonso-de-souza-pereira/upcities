<template>
  <header class="fixed top-0 left-0 w-full bg-white shadow-md z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <button 
        aria-label="Abrir Menu" 
        @click="toggleMenu" 
        class="text-gray-icon hover:text-primary transition-colors desktop:hidden p-2 rounded-full"
      >
        <ChevronRight v-if="!isMenuOpen" />
        <ChevronLeft v-else/>
      </button>

      <div class="flex items-center">
        <span class="text-primary font-bold text-lg desktop:block">PREFEITURA DA SUA CIDADE</span>
      </div>

      <MenuMobile
        v-if="isMobile"
        :items="navItems" 
        :active-key="activeItem" 
        :is-open="isMenuOpen"
        @item-click="setActive" 
      />

      <Menu
        v-else
        :items="navItems" 
        :is-open="isMenuOpen"
        @item-click="setActive" 
      />

      <div class="flex items-center space-x-4">
        
        <span v-if="!isMobile" class="text-black inline">Entrar</span>
        <button v-if="!isMobile" aria-label="Pesquisar" class="text-gray-icon hover:text-black transition-colors">
          <User class="text-primary"/>
        </button>
        

        <span v-if="!isMobile" class="text-black inline">Buscar</span>
        <button aria-label="Pesquisar" class="text-gray-icon hover:text-black transition-colors">
          <Search class="text-primary"/>
        </button>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Search, ChevronLeft, ChevronRight, User } from 'lucide-vue-next';
import { useIsMobile } from '../composables/useIsMobile';
import Menu from './../components/Menu.vue'; 
import MenuMobile from './../components/MenuMobile.vue'; 

export default defineComponent({
  name: 'HeaderLayout',
  components: {
    Search,
    ChevronLeft,
    ChevronRight,
    User,
    Menu,
    MenuMobile,
  },
  setup() {
    const isMenuOpen = ref(false);
    const { isMobile } = useIsMobile();

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const navItems = [
      { name: 'Agendar', key: 'Agendar', to: '/agendar' }, 
      { name: 'Meus Agendamentos', key: 'MeusAgendamentos', to: '/meus-agendamentos' },
      { name: 'Ajuda', key: 'Ajuda', to: '/ajuda' },
    ];

    const activeItem = ref('Ajuda');

    const setActive = (key: string) => {
      activeItem.value = key;
      if (isMenuOpen.value) {
        isMenuOpen.value = false;
      }
    };

    return {
      isMenuOpen,
      isMobile,
      toggleMenu,
      navItems,
      activeItem,
      setActive,
      Menu,
      MenuMobile
    };
  },
});
</script>