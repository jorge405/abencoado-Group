import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/login.vue';
import RegistroNuevo from '../views/RegistroNuevo.vue';
import perfilEmpresa from '../views/perfilEmpresa.vue';
import cotizaciones from '../views/cotizaciones.vue';
import PlanCuentas from '@/views/planCuentas.vue';
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
    },
    {
      path:'/perfilEmpresa',
      name:'perfilEmpresa',
      component:perfilEmpresa,
    },
    {
      path:'/cotizaciones',
      name:'cotizaciones',
      component:cotizaciones,
    },
    {
      path:'/planCuentas',
      name:'planCuentas',
      component:PlanCuentas
    }
    
  ],
})

export default router
