import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import Vuex from 'vuex';
import i18n from '@i18n';
import { configure, addParameters, addDecorator } from '@storybook/vue';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import '~/mock.js';
import VTextarea from '@comp/form/VTextarea.vue';
import CaptchaInput from '@comp/form/CaptchaInput.vue';
import NetSelect from '@comp/form/NetSelect.vue';
import AsyncComponent from '@comp/AsyncComponent';
import SingleMessage from '@comp/alert/SingleMessage.js';
import LocaleTable from '@comp/helper/LocaleTable.vue';

Vue.use(Antd);
Vue.use(Vuex);
Vue.component('v-textarea', VTextarea);
Vue.component('captcha-input', CaptchaInput);
Vue.component('net-select', NetSelect);
Vue.component('async-component', AsyncComponent);
Vue.component('locale-table', LocaleTable)
Vue.prototype.$message.show = SingleMessage.show;
Vue.prototype.$message.close = SingleMessage.close;

addParameters({ 
  viewMode: 'docs',
  options: {
    name: '模式库',
    selectedPanel: 'docs'
  },
  docs: { 
    inlineStories: true,
    container: DocsContainer,
    page: DocsPage,
  },
});
addDecorator(() => ({
  template: '<story/>',
  i18n,
}));