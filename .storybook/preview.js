import Vue from 'vue';
import {
  Col,
  Row,
  Switch,
  Radio,
  AutoComplete,
  Table,
  Modal,
  Select,
  Tooltip,
  Affix,
  Button,
  Breadcrumb,
  Card,
  Divider,
  Drawer,
  Dropdown,
  Form,
  FormModel,
  Icon,
  Input,
  Checkbox,
  Layout,
  LocaleProvider,
  Menu,
  Spin,
  Tabs,
  Anchor,
  Tree,
  message,
} from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.less';
import Vuex from 'vuex';
import i18n from '@i18n';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import '~/mock.js';
import VTextarea from '@comp/form/VTextarea.vue';
import CaptchaInput from '@comp/form/CaptchaInput.vue';
import LocaleTable from '@comp/helper/LocaleTable.vue';
import smessage from  '@layout/components/Message.js';

Vue.use(Col);
Vue.use(Row);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(AutoComplete);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(Tooltip);
Vue.use(Affix);
Vue.use(Button);
Vue.use(Breadcrumb);
Vue.use(Card);
Vue.use(Divider);
Vue.use(Drawer);
Vue.use(Dropdown);
Vue.use(Form);
Vue.use(FormModel);
Vue.use(Icon);
Vue.use(Input);
Vue.use(Checkbox);
Vue.use(Layout);
Vue.use(LocaleProvider);
Vue.use(Menu);
Vue.use(Spin);
Vue.use(Tabs);
Vue.use(Anchor);
Vue.use(Tree);
Vue.use(Vuex);
Vue.component('v-textarea', VTextarea);
Vue.component('captcha-input', CaptchaInput);
Vue.component('locale-table', LocaleTable);

Vue.prototype.$message = { ...message, ...smessage };

export const parameters = { 
  viewMode: 'docs',
  options: {
    name: '模式库',
    selectedPanel: 'docs',
  },
  docs: { 
    inlineStories: true,
    container: DocsContainer,
    page: DocsPage,
  },
  options: {
    sortySort: {
    }
  }
};
export const decorators = [() => ({
  template: '<story/>',
  i18n,
})];
