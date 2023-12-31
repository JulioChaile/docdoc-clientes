import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'
import auth from '../auth'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: 'history',
    // mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    if (to.path.includes('index.html')) {
      next(!auth.isLoggedIn
        ? {
          path: '/Login',
          params: { redirect: '/#' }
        }
        : {
          path: '/#'
        }
      )  
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!auth.isLoggedIn) {
        next({
          path: '/Login',
          params: { redirect: to.fullPath }
        })
      } else {
        if (!to.path.includes('Login')) {
          next()
        }
      }
    } else {
      next()
    }
  })

  return Router
}
