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
    render () {
      return (
        <a-locale-provider locale={ this.$store.state.local4antd }>
          <router-view />
        </a-locale-provider>
      );
    },
  });
  app.$mount('#app');
});
