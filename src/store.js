import Vuex from 'vuex';
import { createApp } from 'vue';

const app = createApp({});
app.use(Vuex);

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || null,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    removeToken(state) {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  actions: {
    saveToken({ commit }, token) {
      commit('setToken', token);
    },
    clearToken({ commit }) {
      commit('removeToken');
    },
  },
  getters: {
    getToken: state => state.token,
  },
});
