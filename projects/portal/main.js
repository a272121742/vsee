// 加载vue
import Vue from 'vue';

// 加载皮肤组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

// 加载本地路由
import { router } from '@lib/auto-router.js';
// 加载本地store
// 加载本地化文件
import i18n from '@lib/auto-i18n.js';
// 添加进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 加载全局自定义皮肤
import '~~/global.less';

import AsyncComponent from '@comp/AsyncComponent';
import { debounce } from 'lodash';

import VueLazyload from 'vue-lazyload';
import store from '@store';

Vue.use(VueLazyload);
Vue.component('async-component', AsyncComponent);

// 加载权限控制
// import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);
if (store.state.allowLogin) {
  router.beforeEach((to, from, next) => {
    NProgress.start(); // 开始进度条
    // 是否跳转到登陆界面
    const toLogin = to.matched.some(r => r.path.toLowerCase() === '/login');
    // 是否已经登陆
    const {isLogin} = store.state;
    // 已经通过登陆时，如果进入的不是登陆，直接放行
    if (isLogin && !toLogin) {
      if (to.path === '/') {
        next({ path: '/home/home' });
      }
      next();
    }
    // 已经通过登陆时，如果进入的是登陆，跳转到主页
    if (isLogin && toLogin) {
      next({
        path: '/',
      });
    }
    // 如果进入的不是登陆界面，且未登陆过
    if (!toLogin && !isLogin) {
      next({
        name: 'Login',
        query: {
          redirect: to.fullPath,
        },
      });
    }
    // 登陆过但不是登陆界面就直接放行，或者没登陆但进入的是登陆界面直接放行
    if (to.path === '/') {
      next({ path: '/home/home' });
    }
    next(true);
  });
} else {
  router.beforeEach((to, from, next) => {
    NProgress.start(); // 完成进度条
    if (to.path === '/') {
      next({ path: '/home/home' });
    }
    next();
  });
}
router.afterEach(() => {
  NProgress.done(); // 完成进度条
});


// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  i18n,
  el: '#app',
  name: 'App',
  mounted () {
    // 消息全局配置
    this.$message.config({
      top: '80px',
    });
    window.addEventListener('scroll', debounce(() => {
      document.querySelectorAll('input:focus').forEach(item => item.blur());
      document.querySelectorAll('.ant-select-open').forEach(item => item.click());
    }, 400));
  },
  render () {
    return (
      <div id="app">
        <a-locale-provider locale={this.$store.state.local4antd}>
          <router-view />
        </a-locale-provider>
      </div>
    );
  },
});
