// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
// eslint-disable-next-line import/extensions
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

// eslint-disable-next-line import/no-unresolved
Vue.use(require('vue-moment'));

new Vue({
  vuetify,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
