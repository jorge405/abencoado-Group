import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue';
import RegistroNuevo from '../views/RegistroNuevo.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login,
    },
    {
      path:'/registroNuevo',
      name:'RegistroNuevo',
      component:RegistroNuevo
    }
    
  ],
})

export default router
