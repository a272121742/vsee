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
  Icon,
  Input,
  Layout,
  LocaleProvider,
  Menu,
  Spin,
  Tabs,
  Anchor,
  message,
} from 'ant-design-vue'
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
Vue.use(Icon);
Vue.use(Input);
Vue.use(Layout);
Vue.use(LocaleProvider);
Vue.use(Menu);
Vue.use(Spin);
Vue.use(Tabs);
Vue.use(Anchor);
Vue.use(Vuex);
Vue.component('v-textarea', VTextarea);
Vue.component('captcha-input', CaptchaInput);
Vue.component('net-select', NetSelect);
Vue.component('async-component', AsyncComponent);
Vue.component('locale-table', LocaleTable)
message.show = SingleMessage.show;
message.close = SingleMessage.close;

addParameters({ 
  viewMode: 'docs',
  options: {
    name: '模式库',
    selectedPanel: 'docs',
    storySort: (a, b) => {
      return 1;
    }
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