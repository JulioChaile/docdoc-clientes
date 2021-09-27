
import Index from '../pages/Index'
import Login from '../pages/Login'
import Audiencias from '../pages/Audiencias'
import Consultas from '../pages/Consultas'
import Reportar from '../pages/Reportar'
import Caso from '../pages/Caso'

const routes = [
  {
    path: '/',
    component: () => import('layouts/DocdocLayout.vue'),
    children: [
      {
        path: '',
        name: 'Mis casos',
        component: Index,
        meta: {
          requiresAuth: true
        }
      },
      {
        path: 'Login',
        name: 'Login',
        component: Login,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'Consultas',
        name: 'Mis Consultas',
        component: Consultas,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'Audiencias',
        name: 'Mis Audiencias',
        component: Audiencias,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'Reportar',
        name: 'Reportar Error',
        component: Reportar,
        meta: {
          requiresAuth: false
        }
      },
      {
        path: 'Caso',
        name: 'Caso',
        component: Caso,
        meta: {
          requiresAuth: true
        },
        props: (route) => ({ id: route.query.id, caratula:  route.query.caratula })
      }
    ]
  }
  /* {
    path: '/Chat',
    component: () => import('layouts/ChatLayout.vue'),
    children: [
      {
        path: '/',
        name: 'Chat',
        component: () => import('pages/Chat.vue'),
        props: true,
        meta: { requiresAuth: true }
      }
    ]
  } */
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
