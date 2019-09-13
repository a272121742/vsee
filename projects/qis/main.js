// 加载vue
import Vue from 'vue';

// 加载皮肤组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less'

// 加载本地路由
import { router } from '@lib/auto-router.js';
// 加载本地store
import store from '@lib/auto-store.js';
// 加载本地化文件
import i18n from '@lib/auto-i18n.js';

// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);

// 生产环境下，将多个项目关联起来（本项目是无授权的，要通过其他项目授权）
if (process.env.NODE_ENV === 'production') {
  const token = store.getters.getToken();
  router.beforeEach((to, from, next) => {
    if (!token) {
      window.location.href = '/portal';
    }
    next();
  });
} else {
  // eslint-disable-next-line no-new
  new Vue({
    router,
    store,
    i18n,
    el: '#app',
    name: 'App',
    data () {
      return {
        locale: null
      };
    },
    beforeCreate () {
      this.$store && this.$store.dispatch('loadLanguage').then(locale => {
        import(`ant-design-vue/lib/locale-provider/${locale}`).then(res => {
          this.$set(this, 'locale', res.default)
        });
      });
    },
    render () {
      return (
        <div id="app">
          <a-locale-provider locale={this.locale}>
            <router-view />
          </a-locale-provider>
        </div>
      )
    }
  });
}


