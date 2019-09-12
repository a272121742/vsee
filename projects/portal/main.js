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
// import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);

if (store.state.allowLogin) {
  router.beforeEach((to, from, next) => {
    // 是否跳转到登陆界面
    const toLogin = to.matched.some(r => r.path.toLowerCase() === '/login');
    // 是否已经登陆
    const isLogin = (store.state.login && store.state.login.isLogin);
    // 已经通过登陆时，如果进入的不是登陆，直接放行
    if (isLogin && !toLogin) {
      next();
    }
    // 已经通过登陆时，如果进入的是登陆，跳转到主页
    if (isLogin && toLogin) {
      next({
        path: '/'
      });
    }
    // 如果进入的不是登陆界面，且未登陆过
    if (!toLogin && !isLogin) {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
    // 登陆过但不是登陆界面就直接放行，或者没登陆但进入的是登陆界面直接放行
    next(true);
  });
}


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
  beforeCreate() {
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
