/* eslint-disable import/no-unresolved */
import Vue from 'vue';
import Vuex from 'vuex';

// eslint-disable-next-line import/extensions
import devices from '@/modules/devices';
// eslint-disable-next-line import/extensions
import modals from '@/modules/modals';
// eslint-disable-next-line import/extensions
import stats from '@/modules/stats';
// eslint-disable-next-line import/extensions
import sessions from '@/modules/sessions';
// eslint-disable-next-line import/extensions
import auth from '@/modules/auth';

Vue.use(Vuex);

export default new Vuex.Store({
  // eslint-disable-next-line object-curly-newline
  modules: { devices, modals, stats, sessions, auth },
// eslint-disable-next-line eol-last
});