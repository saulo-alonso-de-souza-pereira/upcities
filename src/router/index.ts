import { createRouter, createWebHistory } from 'vue-router';

import AgendaPage from '@/views/AgendaPage.vue';
import AppointmentsPage from '@/views/AppointmentsPage.vue';
import HelpPage from '@/views/HelpPage.vue';
import NotFound from '@/views/NotFound.vue';

const routes = [
  {
    path: '/agendar',
    name: 'Agendar',
    component: AgendaPage,
  },
  {
    path: '/meus-agendamentos',
    name: 'MeusAgendamentos',
    component: AppointmentsPage,
  },
  {
    path: '/ajuda',
    name: 'Ajuda',
    component: HelpPage,
  },
  {
    path: '/',
    redirect: '/ajuda',
  },
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: NotFound,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});

export default router;