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
  TreeSelect,
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
  Input,
  Layout,
  ConfigProvider,
  Menu,
  Spin,
  Tabs,
  Anchor,
  message,
  DatePicker,
  Empty,
  Avatar,
  Alert,
  Progress,
  Upload,
  Popconfirm,
} from 'ant-design-vue';
import AIcon from '@comp/general/AIcon.js';
import SingleMessage from '@comp/alert/SingleMessage.js';
import AsyncComponent from '@comp/AsyncComponent';
import DATETIME_HELPER from '@util/datetime-helper.js';

Vue.use(DATETIME_HELPER);
Vue.component('async-component', AsyncComponent);
Vue.component('v-upload', () => import('@comp/form/VUpload.vue'));
Vue.component('v-textarea', () => import('@comp/form/VTextarea.vue'));
Vue.component('multiple-net-select', () => import('@comp/form/MultipleNetSelect.vue'));
Vue.component('single-net-select', () => import('@comp/form/SingleNetSelect.vue'));
Vue.component('net-auto-complete', () => import('@comp/form/NetAutoComplete.vue'));
Vue.use(AIcon, { prefix: 'icon', url: ['/static/icon/logo.js', '/static/icon/iconfont.js', '/static/icon/iconfont-new.js'] });
Vue.use(Col);
Vue.use(Row);
Vue.use(Switch);
Vue.use(Radio);
Vue.use(AutoComplete);
Vue.use(Table);
Vue.use(Modal);
Vue.use(Select);
Vue.use(TreeSelect);
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
Vue.use(Input);
Vue.use(Layout);
Vue.use(ConfigProvider);
Vue.use(Menu);
Vue.use(Spin);
Vue.use(Tabs);
Vue.use(Anchor);
Vue.use(DatePicker);
Vue.use(Empty);
Vue.use(Avatar);
Vue.use(Alert);
Vue.use(Progress);
Vue.use(Upload);
Vue.use(Popconfirm);


Vue.config.productionTip = false;
message.config({
  top: '360px',
  maxCount: 1,
});
message.show = SingleMessage.show;
message.close = SingleMessage.close;
Vue.prototype.$message = message;

Vue.prototype.$info = Modal.info;
Vue.prototype.$success = Modal.success;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
Vue.prototype.$confirm = Modal.confirm;
Vue.prototype.$destroyAll = Modal.destroyAll;
