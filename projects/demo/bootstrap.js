import Vue from 'vue';

// 加载皮肤组件
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
  ConfigProvider,
  Menu,
  Spin,
  Tabs,
  Anchor,
  Checkbox,
  Alert,
  DatePicker,
  Result,
  message,
} from 'ant-design-vue';

import SingleMessage from '@comp/alert/SingleMessage.js';
import { debounce } from 'lodash';
import AsyncComponent from '@comp/AsyncComponent';

Vue.component('async-component', AsyncComponent);

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
Vue.use(ConfigProvider);
Vue.use(Menu);
Vue.use(Spin);
Vue.use(Tabs);
Vue.use(Anchor);
Vue.use(Checkbox);
Vue.use(Alert);
Vue.use(DatePicker);
Vue.use(Result);

// Vue.component('a-icon', Icon.createFromIconfontCN({
//   scriptUrl: '/static/icon/iconfont.js',
// }));

Vue.config.productionTip = false;
message.config({
  top: '180px',
});
message.show = SingleMessage.show;
message.close = SingleMessage.close;
Vue.prototype.$message = message;

// 页面滚动后，相关组件收起下拉
window.addEventListener('scroll', debounce(() => {
  document.querySelectorAll('input:focus').forEach((item) => item.blur());
  document.querySelectorAll('.ant-select-open').forEach((item) => item.click());
}, 400));
