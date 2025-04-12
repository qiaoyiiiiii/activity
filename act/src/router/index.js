import { createRouter, createWebHistory } from 'vue-router'

const router=createRouter({
  history:createWebHistory(),
  routes:[
    {
      path:'/',
      component:()=>import('../views/index.vue'),
      name: 'Home'
    },
    {
      path:'/activity',component:()=>import('../views/activity.vue')
    },
    {
      path:'/activity/:id',component:()=>import('../views/detail.vue')
    },
    {
      path:'/create',component:()=>import('../views/create.vue')
    },
    {
      path:'/login',component:()=>import('../views/login.vue')
    },
    {
      path:'/personal',component:()=>import('../views/Personal.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

export default router