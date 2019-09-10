/* eslint-disable no-param-reassign */
/* eslint-disable no-array-constructor */
/* eslint-disable vars-on-top */
/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable operator-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-bitwise */
// 加载vue
import Vue from 'vue';

// 加载皮肤组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'

// 加载本地路由
import { router } from '@lib/auto-router.js';
// 加载本地store
import store from '@lib/auto-store.js';
// 加载本地化文件
import i18n from '@lib/auto-i18n.js';
import zh from 'ant-design-vue/lib/locale-provider/zh_CN';
import('@dir/v-permission.js')

Vue.config.productionTip = false;
Vue.use(Antd);

// eslint-disable-next-line no-new
new Vue({
  router,
  store,
  i18n,
  el: '#app',
  name: 'App',
  data () {
    return {
      locale: zh
    };
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
