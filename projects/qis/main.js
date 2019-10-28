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

// 加载全局自定义皮肤
import '~~/global.less';

import AsyncComponent from '@comp/AsyncComponent';
import { debounce } from '@util/fnhelper.js';
import store from '@store';


Vue.component('async-component', AsyncComponent);

// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);
const token = store.getters.getToken();
// 生产环境下，将多个项目关联起来（本项目是无授权的，要通过其他项目授权）


router.beforeEach((to, from, next) => {
  /**
   * 查找去向
   * @param {*} menus 服务端传回的地址
   * @param {*} flag 标记，是需要服务端验证，默认`false`
   */
  function findNext (menus = []) {
    const urlList = menus.map(item => item.url);
    if (~['/403', '/404', '/500'].indexOf(to.path)) {
      return true;
    }
    // 本地找不到这个地址
    if (router.matcher.match(to.path).name === '404') {
      return { path: '404' };
    }
    // 服务端未配置这个地址
    if (!~urlList.indexOf(to.path)) {
      if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
        return { path: urlList[0] };
      }
      if (!~['/home/home', '/question/list', '/question/search'].indexOf(to.path)) {
        return true;
      }
      return { path: '404' };
    }
    if (to.path === '/' && urlList[0] && urlList[0] !== '/') {
      return { path: urlList[0] };
    }
    return true;
  }
  if (process.env.NODE_ENV === 'production' && !token) {
    store.commit('logout');
  }
  NProgress.start(); // 开始进度条
  if (!store.state.menus.length) {
    store.dispatch('fetchMenus').then(res => {
      next(findNext(res));
    });
  } else {
    next(findNext(store.state.menus));
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
      locale: null
    };
  },
  beforeCreate () {
    this.$store && this.$store.dispatch('loadLanguage').then(locale => {
      import(`ant-design-vue/lib/locale-provider/${locale}`).then(res => {
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
      top: '80px'
    });
    window.addEventListener('scroll', debounce(() => {
      document.querySelectorAll('input:focus').forEach(item => item.blur());
      document.querySelectorAll('.ant-select-open').forEach(item => item.click());
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
  }
});
