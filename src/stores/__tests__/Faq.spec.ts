import { setActivePinia, createPinia } from 'pinia';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { useFaqStore } from '@/stores/Faq'; 
import * as api from '@/api/upticket';


const mockFaqData = [
  { answer: 'Resposta 1', ticket: { description: 'Pergunta A' } },
  { answer: 'Resposta 2', ticket: { description: 'Pergunta B' } },
  { answer: 'Resposta 3', ticket: { description: null } }, 
];

describe('Faq Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.spyOn(api, 'fetchData').mockClear();
  });

  it('deve ter um estado inicial correto', () => {
    const store = useFaqStore();
    expect(store.cards).toEqual([]);
    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
  });

  it('deve buscar dados e atualizar o estado em caso de SUCESSO', async () => {

    const expectedCards = mockFaqData.filter(item => item.ticket.description !== null);
        
    vi.spyOn(api, 'fetchData').mockResolvedValueOnce(mockFaqData);

    const store = useFaqStore();

    expect(store.isLoading).toBe(false);

    const promise = store.fetchFaqData();

    expect(store.isLoading).toBe(true);

    await promise;

    expect(store.isLoading).toBe(false);
    expect(store.error).toBeNull();
        
    expect(store.cards.length).toBe(2);
    expect(store.cards).toEqual(expectedCards);
        
    expect(api.fetchData).toHaveBeenCalledWith('/public-answer');
  });

  it('deve definir o estado de erro em caso de FALHA na API', async () => {
    const mockError = new Error('Falha na comunicação com o servidor.');
    vi.spyOn(api, 'fetchData').mockRejectedValueOnce(mockError);

    const store = useFaqStore();
    
    await store.fetchFaqData();

    expect(store.isLoading).toBe(false);
    expect(store.cards).toEqual([]);
    
    expect(store.error).not.toBeNull();
    expect(store.error).toContain('Não foi possível carregar');
  });
});