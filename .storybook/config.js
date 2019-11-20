import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { configure, addParameters } from '@storybook/vue';
import '~/mock.js';
import VTextarea from '@comp/form/VTextarea.vue';
import CaptchaInput from '@comp/form/CaptchaInput.vue';
import NetSelect from '@comp/form/NetSelect.vue';
import AsyncComponent from '@comp/AsyncComponent';
import SingleMessage from '@comp/alert/SingleMessage.js';

Vue.use(Antd);
Vue.component('v-textarea', VTextarea);
Vue.component('captcha-input', CaptchaInput);
Vue.component('net-select', NetSelect);
Vue.component('async-component', AsyncComponent);
Vue.prototype.$message.show = SingleMessage.show;
Vue.prototype.$message.close = SingleMessage.close;

addParameters({ 
  options: {
    name: '模式库',
    selectedPanel: 'docs'
  },
  docs: { 
    inlineStories: true,
  } 
});

// automatically import all files ending in *.stories.js
configure(require.context('../stories', true, /\.story\.(js|mdx)$/), module);

export const TOKEN_KEY = 'login_token';
export const LANGUAGE_KEY = 'language';
export const LANGUAGE_DEFAULT = 'zh-CN';
export const LOGIN_CACHE_KEY = 'cache_login_info';
export const OTHER_GET_PARAMS = {
  _t: new Date()
}
