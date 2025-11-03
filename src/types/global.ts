export interface FaqItem {
  answer: string;
  ticket: {
    description: string | null;
  };
}

export interface FaqApiResponse {
  data: FaqItem[];
}