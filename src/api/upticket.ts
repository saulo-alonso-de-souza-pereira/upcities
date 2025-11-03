interface ApiEnvelope<T> {
    data: T;
}

const BASE_URL = 'https://upticket.uppersoft.cc/api/v1';

export async function fetchData<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Erro de rede: ${response.status} ${response.statusText}`);
    }

    const responseJson: ApiEnvelope<T> = await response.json(); 

    return responseJson.data;

  } catch (error) {
    console.error(`Falha na requisição para ${url}:`, error);
    throw new Error('Falha na comunicação com o servidor.');
  }
}
