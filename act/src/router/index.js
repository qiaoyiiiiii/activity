import { createRouter, createWebHistory } from 'vue-router'

const router=createRouter({
  history:createWebHistory(),
  routes:[
    {
      path:'/',component:()=>import('../views/index.vue')
    },
    // {
    //   path:'/activities',component:()=>import('../views/activities.vue')
    // },
    // {
    //   path:'/create',component:()=>import('../views/create.vue')
    // },
    // {
    //   path:'/login',component:()=>import('../views/login.vue')
    // },
    // {
    //   path:'/register',component:()=>import('../views/register.vue')
    // }
  ]
})

export default router