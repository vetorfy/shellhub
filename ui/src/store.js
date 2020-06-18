import Vue from '../node_modules/vue';
import Vuex from '../node_modules/vuex';
import stats from './modules/stats';
import sessions from './modules/sessions';
import auth from './modules/auth';
import devices from './modules/devices';
import modals from './modules/modals';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    devices, modals, stats, sessions, auth,
  },
});
