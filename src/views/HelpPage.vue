<template>
  <div class="min-h-screen bg-background-page pt-16 font-montserrat">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 desktop:py-12">
      <h1 class="flex items-center text-black font-bold mb-6 desktop:mb-8"
        :class="{'text-xl': isMobile, 'text-2xl desktop:text-3xl': !isMobile}">
        
        <div class="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center mr-2">
          <CircleQuestionMark class="text-black"/>
        </div>
        Ajuda
      </h1>

      <div class="relative mb-8 desktop:mb-12">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Digite sua dúvida"
          class="w-full pl-10 pr-10 py-3 border border-gray-border rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          :class="{'text-gray-search': !searchTerm}"
        />
        <button
          v-if="searchTerm"
          @click="clearSearch"
          aria-label="Limpar busca"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-search hover:text-black"
        >
          <CircleX class="w-5 h-5"/>
        </button>
        <Search class="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-search block"/>
      </div>

      <div v-if="searchTerm" class="mb-6 desktop:mb-8 text-black font-montserrat text-base">
        Resultados encontrados para: <span class="font-semibold">{{ searchTerm }}</span>
      </div>

      <div v-if="filteredCards.length > 0">
        <HelpCard
            v-for="(card, index) in filteredCards"
            :key="index"
            :title="card.ticket.description || ''"
            :content="card.answer"
          />
      </div>

      <div v-else class="bg-white p-8 rounded-lg shadow-sm flex flex-col items-center justify-center text-center">
        <img v-if="searchTerm" src="@/assets/ilustracao.svg" alt="Nenhum resultado encontrado" class="mb-4" />
        <img v-else src="https://via.placeholder.com/150x150/f0f0f0/3a3a3a?text=Ajuda" alt="Página de ajuda" class="mb-4" />
        
        <p v-if="searchTerm" class="text-black font-montserrat text-lg font-semibold mb-2">
          Não foram encontrados resultados para a busca.
        </p>
        <p v-else class="text-black font-montserrat text-lg font-semibold mb-2">
          Como podemos te ajudar hoje?
        </p>

        <p class="text-gray-search font-montserrat text-sm mb-4">
          {{ searchTerm ? 'Confira os dados e tente novamente.' : 'Digite sua dúvida no campo acima.' }}
        </p>

        <button
          v-if="searchTerm"
          @click="clearSearch"
          class="flex items-center text-primary hover:text-green-700 transition-colors font-semibold text-sm desktop:text-base"
        >
          <Undo2/>
          Limpar busca
        </button>
      </div>
    </div>
    
    <button
      v-show="showScrollToTop"
      @click="scrollToTop"
      aria-label="Voltar ao topo"
      class="fixed bottom-6 right-6 p-3 bg-primary text-white rounded-full shadow-lg transition-opacity duration-300 hover:text-black hover:bg-primary-light"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
    </button>
  </div>
</template>

<script lang="ts">
import { Undo2, Search, CircleX, CircleQuestionMark } from 'lucide-vue-next';
import { useIsMobile } from './../composables/useIsMobile';
import { defineComponent, ref, computed, onMounted, onUnmounted } from 'vue';
import HelpCard from './../components/HelpCard.vue';
import { useFaqStore } from './../stores/Faq';


export default defineComponent({
  name: 'HelpPage',
  components: {
    HelpCard,
    Undo2,
    Search,
    CircleX,
    CircleQuestionMark
  },
  setup() {
    const faqStore = useFaqStore();
    const searchTerm = ref('');
    const showScrollToTop = ref(false);
    const { isMobile } = useIsMobile();

    onMounted(() => {
      window.addEventListener('scroll', handleScroll);
      if (faqStore.cards.length === 0) {
          faqStore.fetchFaqData();
      }
    });

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    const filteredCards = computed(() => {
      const allCards = faqStore.cards;
      if (!searchTerm.value) {
        return allCards;
      }
      
      const term = searchTerm.value.toLowerCase().trim();
      
      return allCards.filter(card => {
        const titleMatch = card.ticket.description?.toLowerCase().includes(term);
        const contentMatch = card.answer.toLowerCase().includes(term);
        return titleMatch || contentMatch;
      });
    });


    const clearSearch = () => {
      searchTerm.value = '';
    };

    const handleScroll = () => {
      showScrollToTop.value = window.scrollY > 300;
    };

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    return {
      searchTerm,
      filteredCards,
      clearSearch,
      showScrollToTop,
      scrollToTop,
      isMobile,
      faqStore,
    };
  }
});
</script>