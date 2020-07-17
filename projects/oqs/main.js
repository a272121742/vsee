import Vue from 'vue';
import i18n from '@i18n';
import router from '@router';
import store from '@store';
import { debounce } from 'lodash';
import echarts from 'echarts';

Vue.prototype.$echarts = echarts;
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
    methods: {
      contentScroll: debounce(() => {
        document.querySelectorAll('input:focus').forEach((item) => item.blur());
        document.querySelectorAll('.ant-select-open, .ant-dropdown-open').forEach((item) => item.click());
      }, 800, { leading: true, trailing: false }),
    },
    render () {
      return (
        <a-config-provider id="app" locale={ this.$store.state.local4antd }>
          <router-view />
        </a-config-provider>
      );
    },
  });
  app.$mount('#app');
});
