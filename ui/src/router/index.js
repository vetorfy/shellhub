/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import Router from 'vue-router';
// eslint-disable-next-line import/extensions
// eslint-disable-next-line import/no-useless-path-segments
import Dashboard from './../views/Dashboard.vue';
// eslint-disable-next-line import/no-useless-path-segments
import store from './../store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
    },
    {
      path: '/devices',
      name: 'devices',

      component: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
        import(/* webpackChunkName: 'devices' */ './../views/Devices.vue'),
    },
    {
      path: '/device/:id',
      name: 'detailsDevice',
      component: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
        import(/* webpackChunkName: 'details-device' */ './../views/DetailsDevice.vue'),
    },
    {
      path: '/sessions',
      name: 'sessions',
      component: () =>
      // eslint-disable-next-line implicit-arrow-linebreak
        import('./../views/Sessions.vue'),
    },
    {
      path: '/session/:id',
      name: 'detailsSession',
      component: () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        import(/* webpackChunkName: 'details-session' */ './../views/DetailsSession.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () =>
        // eslint-disable-next-line implicit-arrow-linebreak
        import('./../views/Login.vue'),
    },
    {
      path: '*',
      name: 'NotFound',
      component: Dashboard,
      redirect: () => {
        localStorage.setItem('flag', true);
        return '/';
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (store.getters['auth/isLoggedIn']) {
      return next();
    }
    return next(`/login?redirect=${to.path}`);
  // eslint-disable-next-line no-else-return
  } else {
    if (store.getters['auth/isLoggedIn']) {
      return next('/');
    }
    return next();
  }
});

export default router;
