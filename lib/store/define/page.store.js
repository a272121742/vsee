import Vue from 'vue';
import config from '~/config.js';

const {
  PORTAL_APTH = '/',
} = config;

export default {
  state: {
    // 内容区域刷新控制
    refresh: false,
    // 全局区域刷新控制
    reload: false,
  },
  mutations: {
    setRefresh (state, refresh = false) {
      state.refresh = refresh;
    },
    setReload (state, reload = false) {
      state.reload = reload;
    },
  },
  actions: {
    refresh ({ commit }) {
      commit('setRefresh', true);
      Vue.nextTick(() => {
        commit('setRefresh', false);
      });
    },
    reload ({ commit }) {
      commit('setReload', true);
      Vue.nextTick(() => {
        commit('setReload', false);
      });
    },
    gohome () {
      Vue.nextTick(() => {
        window.location.replace(PORTAL_APTH);
      });
    },
  },
};
