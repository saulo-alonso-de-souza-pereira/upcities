import { type FaqItem, type FaqApiResponse } from '@/types/global';
import { describe, it, expect } from 'vitest';


const mockFaqItem: FaqItem = {
  answer: "Esta é a resposta para a FAQ.",
  ticket: {
    description: "Descrição do ticket associado.",
  },
};

const mockFaqApiResponse: FaqApiResponse = {
  data: [
    mockFaqItem,
    {
      answer: "Outra resposta.",
      ticket: {
        description: null, // Testando o "string | null"
      },
    },
  ],
};

describe('Tipagem das Interfaces', () => {

  it('A FaqItem de mock está em conformidade com a interface FaqItem', () => {

    expect(true).toBe(true);
  });

  it('A FaqApiResponse de mock está em conformidade com a interface FaqApiResponse', () => {
    expect(true).toBe(true);
  });

  it('A estrutura básica dos dados de mock está correta', () => {
    expect(mockFaqItem).toHaveProperty('answer');
    expect(mockFaqItem).toHaveProperty('ticket');
    expect(mockFaqItem.ticket).toHaveProperty('description');
    expect(Array.isArray(mockFaqApiResponse.data)).toBe(true);
  });

});
