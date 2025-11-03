import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { fetchData } from '../upticket'; 

const BASE_URL = 'https://upticket.uppersoft.cc/api/v1';


vi.stubGlobal('fetch', vi.fn());
const mockedFetch = vi.mocked(fetch);


let consoleErrorSpy: vi.SpyInstance;

describe('fetchData', () => {

  beforeEach(() => {
    vi.clearAllMocks();

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('deve retornar os dados desempacotados (unwrapped) em caso de sucesso', async () => {
    const mockPayload = { id: 1, name: 'Usuário Teste' };
    const mockEnvelope = { data: mockPayload };
    const path = '/users/1';

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: async () => mockEnvelope,
    } as Response);

    const result = await fetchData(path);

    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockedFetch).toHaveBeenCalledWith(`${BASE_URL}${path}`);
    expect(result).toEqual(mockPayload);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('deve lançar um erro genérico e logar no console se a resposta não for .ok (ex: 404)', async () => {
    const path = '/pagina-nao-encontrada';

    mockedFetch.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ error: 'Não encontrado' }),
    } as Response);

    await expect(fetchData(path))
      .rejects
      .toThrow('Falha na comunicação com o servidor.');

    expect(mockedFetch).toHaveBeenCalledWith(`${BASE_URL}${path}`);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Falha na requisição para ${BASE_URL}${path}:`,
      expect.objectContaining({ message: 'Erro de rede: 404 Not Found' })
    );
  });

  it('deve lançar um erro genérico e logar no console se o fetch() falhar', async () => {
    const path = '/erro-rede';
    const networkError = new Error('Falha na conexão');

    mockedFetch.mockRejectedValue(networkError);

    await expect(fetchData(path))
      .rejects
      .toThrow('Falha na comunicação com o servidor.');

    expect(mockedFetch).toHaveBeenCalledWith(`${BASE_URL}${path}`);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Falha na requisição para ${BASE_URL}${path}:`,
      networkError
    );
  });

  it('deve lançar um erro genérico e logar no console se o response.json() falhar', async () => {
    const path = '/json-invalido';
    const jsonError = new SyntaxError('Unexpected token < in JSON at position 0');

    mockedFetch.mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      json: vi.fn().mockRejectedValue(jsonError),
    } as unknown as Response);

    await expect(fetchData(path))
      .rejects
      .toThrow('Falha na comunicação com o servidor.');

    expect(mockedFetch).toHaveBeenCalledWith(`${BASE_URL}${path}`);

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Falha na requisição para ${BASE_URL}${path}:`,
      jsonError
    );
  });
});