/* eslint-disable no-use-before-define */
import { login } from '../api/auth';
// import { login } from '/api/auth';

export default {
  namespaced: true,

  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || '',
    tenant: localStorage.getItem('tenant') || '',
  },

  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
    currentUser: (state) => state.user,
    tenant: (state) => state.tenant,
  },

  mutations: {
    authRequest(state) {
      state.status = 'loading'; // eslint-disable-line no-param-reassign
    },

    authSuccess(state, data) {
      state.status = 'success'; // eslint-disable-line no-param-reassign
      state.token = data.token; // eslint-disable-line no-param-reassign
      state.user = data.user; // eslint-disable-line no-param-reassign
      state.tenant = data.tenant; // eslint-disable-line no-param-reassign
    },

    authError(state) {
      state.status = 'error'; // eslint-disable-line no-param-reassign
    },

    logout(state) {
      state.status = ''; // eslint-disable-line no-param-reassign
      state.token = ''; // eslint-disable-line no-param-reassign
      state.user = ''; // eslint-disable-line no-param-reassign
      state.tenant = ''; // eslint-disable-line no-param-reassign
    },
  },

  actions: {
    async login(context, user) {
      context.commit('authRequest');

      try {
        const resp = await login(user);

        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('user', resp.data.user);
        localStorage.setItem('tenant', resp.data.tenant);

        context.commit('authSuccess', resp.data);
      } catch (err) {
        context.commit('authError');
      }
    },

    logout(context) {
      context.commit('logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tenant');
      localStorage.removeItem('onceWelcome');
    },
  },
};
