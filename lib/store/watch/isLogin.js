import Vue from 'vue';
import config from '~/config.js';

const {
  PORTAL_PATH = '/',
} = config;

export default (store) => {
  store.watch((state) => state.isLogin, (isLogin) => {
    if (!isLogin) {
      Vue.nextTick(() => {
        const isProd = store.getters.isProd();
        if (isProd) {
          window.location.replace(PORTAL_PATH);
        }
      });
    }
  });
};
