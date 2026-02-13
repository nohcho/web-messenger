import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'messenger',
      component: () => import('@/pages/MessengerPage.vue'),
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('@/pages/ChatPage.vue'),
      props: (route) => ({ chatId: Number(route.params.id) }),
    },
  ],
});

export default router;
