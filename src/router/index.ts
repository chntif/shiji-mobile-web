import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/test/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'test',
      component: () => import('../views/test/index.vue'),
    },
  ],
})

export default router
