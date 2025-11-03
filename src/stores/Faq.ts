import { defineStore } from 'pinia';
import type { FaqItem } from './../types/global'; 
import { fetchData } from './../api/upticket'; 


interface FaqState {
  cards: FaqItem[];
  isLoading: boolean;
  error: string | null;
}

export const useFaqStore = defineStore('faq', {
  state: (): FaqState => ({
    cards: [],
    isLoading: false,
    error: null,
  }),
  actions: {
    async fetchFaqData() {
      this.isLoading = true;
      this.error = null;
      
      try {
        const data = await fetchData<FaqItem[]>('/public-answer');
        
        this.cards = data.filter(item => item.ticket?.description);

      } catch (error) {
        console.error("Falha ao buscar FAQ na Store:", error);
        this.error = 'Não foi possível carregar as perguntas frequentes. Tente novamente.';
      } finally {
        this.isLoading = false;
      }
    },
  },
  getters: {

  }
});