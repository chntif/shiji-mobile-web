import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/index.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test/index.vue'),
    },
  ],
})

export default router
