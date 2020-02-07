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
import moment from 'moment';

// 添加进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';


import AsyncComponent from '@comp/AsyncComponent';
import { debounce } from 'lodash';
import { treeFilter } from '@util/datahelper.js';
import store from '@store';


Vue.component('async-component', AsyncComponent);

// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);

router.beforeEach((to, from, next) => {
  function findNext (menus) {
    if (~['/403', '/404', '/500'].indexOf(to.path)) {
      return true;
    }
    const urlList = menus.map((item) => item.url);
    // 服务端配置中找不到该地址
    if (!~urlList.indexOf(to.path)) {
      if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
        return { ...to, path: urlList[0], replace: true };
      }
    }
    // 客户端配置中找不到该地址
    if (!router.test(to.path)) {
      if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
        return { ...to, path: urlList[0], replace: true };
      }
      return { path: '404', replace: true };
    }
    return true;
  }
  // 判断登陆状态
  if (store.state.isLogin) {
    // 如果加载过菜单
    if (store.state.isMenuLoaded) {
      next(findNext(store.state.menus));
    } else {
      store.dispatch('fetchMenus').then((res) => {
        const issueMenus = treeFilter((item = {}) => item.appCode === 'MASTERDATA' && !!item.url && router.test(item.url), res);
        store.commit('setMenus', issueMenus);
        next(findNext(issueMenus));
      });
    }
  } else {
    store.dispatch('logout');
  }
  next();
});

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
  data () {
    return {
      locale: null,
    };
  },
  beforeCreate () {
    this.$store && this.$store.dispatch('loadLanguage').then((locale) => {
      import(`ant-design-vue/lib/locale-provider/${locale}`).then((res) => {
        this.$set(this, 'locale', res.default);
      });
      if (locale !== 'zh_CN') {
        moment.locale('en');
      } else {
        moment.locale('zh-cn');
      }
    });
  },
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
        <a-locale-provider locale={this.locale}>
          <router-view />
        </a-locale-provider>
      </div>
    );
  },
});
