import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/index.vue'),
      name: 'Home'
    },
    {
      path: '/activity',
      component: () => import('../views/activity.vue')
    },
    {
      path: '/activity/:id',
      component: () => import('../views/detail.vue'),
      meta: { requiresAuth: true } // 添加需要认证的元信息
    },
    {
      path: '/create',
      component: () => import('../views/create.vue'),
      meta: { requiresAuth: true } // 添加需要认证的元信息
    },
    {
      path: '/login',
      component: () => import('../views/login.vue')
    },
    {
      path: '/personal',
      component: () => import('../views/percenter.vue'),
      // meta: { requiresAuth: true }
    },
    {
      path: '/registerinfo',
      component: () => import('../components/personal.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 检查目标路由是否需要认证
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      // 未登录，重定向到登录页面
      next({
        path: '/login',
        // 保存目标路由，登录后可以直接跳转
        query: { redirect: to.fullPath }
      })
    } else {
      // 已登录，允许访问
      next()
    }
  } else {
    // 不需要认证的路由，直接放行
    next()
  }
})

export default router
