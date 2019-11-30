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
import { debounce } from 'lodash';

// 添加进度条
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import AsyncComponent from '@comp/AsyncComponent';
import store from '@store';

import SingleMessage from './home/view/SingleMessage.js';



Vue.component('async-component', AsyncComponent);

// 加载权限控制
import('@dir/v-permission.js');

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.prototype.$message.show = SingleMessage.show;
Vue.prototype.$message.close = SingleMessage.close;

const token = store.getters.getToken();
// 生产环境下，将多个项目关联起来（本项目是无授权的，要通过其他项目授权）

router.beforeEach((to, from, next) => {
  if (process.env.NODE_ENV === 'production' && !token) {
    store.commit('logout');
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
        <a-locale-provider locale={this.$store.state.local4antd}>
          <router-view />
        </a-locale-provider>
      </div>
    );
  }
});

