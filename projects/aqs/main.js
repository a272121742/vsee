import Vue from 'vue';
import i18n from '@i18n';
import router from '@router';
import store from '@store';

Vue.nextTick(() => {
  const app = new Vue({
    router,
    store,
    i18n,
    name: 'App',
    created () {
      const listen = store.watch((state) => state.isLogin, (isLogin) => {
        if (isLogin) {
          this.$store.dispatch('fetchUser');
          listen && listen();
        }
      }, { immediate: true });
    },
    render () {
      return (
        <a-locale-provider id="app" locale={ this.$store.state.local4antd }>
          <router-view />
        </a-locale-provider>
      );
    },
  });
  app.$mount('#app');
});
