import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue'),
      meta: { requiresAuth: true } // 需要登录
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/index.vue'),
      meta: { requiresAuth: true } // 需要登录
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test/index.vue'),
      meta: { requiresAuth: true } // 需要登录
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('../views/auth/index.vue'),
      meta: { requiresAuth: false } // 授权页面不需要登录
    },
  ],
})

// 路由守卫：检查登录状态
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 判断目标路由是否需要登录
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // 判断用户是否已登录
  const isLoggedIn = userStore.isLogin()

  console.log('路由守卫:', {
    to: to.path,
    requiresAuth,
    isLoggedIn
  })

  if (requiresAuth && !isLoggedIn) {
    // 需要登录但未登录，跳转到授权页
    console.log('未登录，跳转到授权页')
    next({
      path: '/auth',
      query: { redirect: to.fullPath } // 保存原始目标路径
    })
  } else if (to.path === '/auth' && isLoggedIn) {
    // 已登录用户访问授权页，直接跳转到首页
    console.log('已登录，跳转到首页')
    next({ path: '/' })
  } else {
    // 其他情况正常访问
    next()
  }
})

export default router
