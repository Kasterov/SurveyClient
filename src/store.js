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
      localStorage.setItem('token', token); // Сохраняем токен в локальное хранилище
    },
  },
  actions: {
    // Действие для сохранения токена
    saveToken({ commit }, token) {
      commit('setToken', token);
    },
  },
  getters: {
    getToken: state => state.token,
  },
});