// 加载vue
import Vue from 'vue';

// 加载皮肤组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';

// 加载本地路由
import { router } from '@lib/auto-router.js';
// 加载本地store
import store from '@lib/auto-store.js';
// 加载本地化文件
import i18n from '@lib/auto-i18n.js';
import moment from 'moment';

// 添加进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// 加载全局自定义皮肤
import '@@cmd/global.less';

import AsyncComponent from '@comp/AsyncComponent';
Vue.component('async-component', AsyncComponent);

// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);

const token = store.getters.getToken();
// 生产环境下，将多个项目关联起来（本项目是无授权的，要通过其他项目授权）

router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === 'production' && !token) {
    window.location.href = `/portal`;
  }
  NProgress.start(); // 开始进度条
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
