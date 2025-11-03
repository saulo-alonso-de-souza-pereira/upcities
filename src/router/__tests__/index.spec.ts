import { describe, it, expect, vi } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';


import router from '@/router';
const DummyComponent = { template: '<div>Dummy</div>' };

const routes = router.options.routes;

const setupRouter = async (initialRoute = '/') => {
  const testRouter = createRouter({
    history: createMemoryHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 };
    },
  });

  await testRouter.push(initialRoute);
  await testRouter.isReady();

  return testRouter;
};


describe('Router Configuration Tests', () => {

  it('should resolve the /agendar route correctly', async () => {
    const testRouter = await setupRouter('/agendar');


    expect(testRouter.currentRoute.value.name).toBe('Agendar');
    expect(testRouter.currentRoute.value.path).toBe('/agendar');

  });


  it('should resolve the /meus-agendamentos route correctly', async () => {
    const testRouter = await setupRouter('/meus-agendamentos');

    expect(testRouter.currentRoute.value.name).toBe('MeusAgendamentos');
    expect(testRouter.currentRoute.value.path).toBe('/meus-agendamentos');
  });


  it('should resolve the /ajuda route correctly', async () => {
    const testRouter = await setupRouter('/ajuda');

    expect(testRouter.currentRoute.value.name).toBe('Ajuda');
    expect(testRouter.currentRoute.value.path).toBe('/ajuda');
  });


  it('should redirect from / to /ajuda', async () => {
    const testRouter = await setupRouter('/');


    expect(testRouter.currentRoute.value.path).toBe('/ajuda');
    expect(testRouter.currentRoute.value.name).toBe('Ajuda');
  });

  it('should resolve any unknown path to the NotFound route', async () => {
    const testRouter = await setupRouter('/rota-que-nao-existe');

    expect(testRouter.currentRoute.value.name).toBe('NotFound');
    expect(testRouter.currentRoute.value.params.catchAll).toEqual('rota-que-nao-existe');
    expect(testRouter.currentRoute.value.fullPath).toBe('/rota-que-nao-existe');
  });


  it('should have scrollBehavior configured to return { top: 0 }', async () => {

    const routerOptions = router.options;

    const mockTo = {};
    const mockFrom = {};
    const mockSavedPosition = null;

    const scrollResult = routerOptions.scrollBehavior(mockTo, mockFrom, mockSavedPosition);

    expect(scrollResult).toEqual({ top: 0 });
  });

});