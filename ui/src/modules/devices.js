// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import * as apiDevice from '../api/devices';

export default {
  namespaced: true,

  state: {
    devices: [],
    device: [],
    numberDevices: 0,
  },

  getters: {
    list: (state) => state.devices,
    get: (state) => state.device,
    getNumberDevices: (state) => state.numberDevices,
    getStatusCode: (state) => state.statusCode,
  },

  mutations: {
    setDevices: (state, res) => {
      Vue.set(state, 'devices', res.data);
      Vue.set(state, 'numberDevices', parseInt(res.headers['x-total-count'], 10));
    },

    removeDevice: (state, uid) => {
      state.devices.splice(state.devices.findIndex((d) => d.uid === uid), 1);
    },

    renameDevice: (state, data) => {
      // eslint-disable-next-line max-len
      state.devices = state.devices.map((i) => (i.uid === data.uid ? { ...i, name: data.name } : i)); // eslint-disable-line no-param-reassign
    },

    setDevice: (state, data) => {
      if (data) {
        Vue.set(state, 'device', data);
      }
    },
  },

  actions: {
    fetch: async (context, data) => {
      const res = await apiDevice.fetchDevices(data.perPage, data.page, data.filter);
      context.commit('setDevices', res);
    },

    remove: async (context, uid) => {
      await apiDevice.removeDevice(uid);
      context.commit('removeDevice', uid);
    },

    rename: async (context, data) => {
      await apiDevice.renameDevice(data);
      context.commit('renameDevice', data);
    },

    get: async (context, uid) => {
      const res = await apiDevice.getDevice(uid);
      context.commit('setDevice', res.data);
    },
  },
};
