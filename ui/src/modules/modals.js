export default {
  namespaced: true,

  state: {
    terminal: '',
    addDevice: false,
  },

  getters: {
    // eslint-disable-next-line arrow-body-style
    terminal: (state) => {
      return state.terminal;
    },

    // eslint-disable-next-line arrow-body-style
    addDevice: (state) => {
      return state.addDevice;
    },
  },

  mutations: {
    setTerminal: (state, data) => {
      state.terminal = data; // eslint-disable-line no-param-reassign
    },

    setAddDevice: (state, data) => {
      state.addDevice = data; // eslint-disable-line no-param-reassign
    },
  },

  actions: {
    toggleTerminal: (context, value) => {
      context.commit('setTerminal', value);
    },

    showAddDevice: (context, value) => {
      context.commit('setAddDevice', value);
    },
  },
};
