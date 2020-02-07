// 加载vue
import Vue from 'vue';

// 加载皮肤组件
import Antd, { Icon } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

// 添加进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 加载全局自定义皮肤
import '~~/global.less';

import AsyncComponent from '@comp/AsyncComponent';
import { debounce } from 'lodash';
import { treeFilter } from '@util/datahelper.js';
import SingleMessage from '@comp/alert/SingleMessage.js';

import i18n from '@i18n';
import router from '@router';
import store from '@store';

Vue.component('async-component', AsyncComponent);
Vue.component('v-icon', Icon.createFromIconfontCN({
  scriptUrl: '/static/icon/iconfont.js',
}));
Vue.component('v-logo', Icon.createFromIconfontCN({
  scriptUrl: '/static/icon/logo.js',
}));


// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.prototype.$message.show = SingleMessage.show;
Vue.prototype.$message.close = SingleMessage.close;

router.beforeEach((to, from, next) => {
  NProgress.start();
  function findNext (menus) {
    const urlList = menus.map((item) => item.url);
    if (!urlList.length) {
      return { path: '403', replace: true };
    }
    if (~['/403', '/404', '/500'].indexOf(to.path)) {
      return true;
    }
    if (to.path === '/') {
      return { path: urlList[0] };
    }
    // // 服务端配置中找不到该地址
    // if (!~urlList.indexOf(to.path)) {
    //   if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
    //     return { path: urlList[0], replace: true };
    //   }
    // }
    // // 客户端配置中找不到该地址
    // if (!router.test(to.path)) {
    //   if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
    //     return { ...to, path: urlList[0], replace: true };
    //   }
    //   return { path: '403', replace: true };
    // }
    return true;
  }
  // 判断登陆状态 TODO: 服务端上线后解开注释
  if (store.state.isLogin) {
    // 如果加载过菜单
    if (store.state.isMenuLoaded) {
      next(findNext(store.state.serverMenus));
    } else {
      store.dispatch('fetchMenus').then((res) => {
        const serverMenus = treeFilter((item = {}) => item.appCode === 'AQS' && !!item.url, res);
        store.commit('setServerMenus', serverMenus);
        Vue.nextTick(() => {
          next(findNext(serverMenus));
        });
      });
    }
  } else if (store.state.isDev) {
    next();
  } else {
    store.dispatch('logout');
  }
  next();
});

router.afterEach(() => {
  NProgress.done(); // 完成进度条
});


Vue.nextTick(() => {
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
        document.querySelectorAll('input:focus').forEach((item) => item.blur());
        document.querySelectorAll('.ant-select-open').forEach((item) => item.click());
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
});
