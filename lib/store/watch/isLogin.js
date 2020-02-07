import Vue from 'vue';

export default (store) => {
  store.watch((state) => state.isLogin, (isLogin) => {
    if (!isLogin) {
      Vue.nextTick(() => {
        const isProd = store.getters.isProd();
        if (isProd) {
          window.location.replace('/portal/login');
        }
      });
    }
  });
};
