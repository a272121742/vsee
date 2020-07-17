import { Icon } from 'ant-design-vue';
import AIcon from './AIcon.vue';

export default {
  install (Vue, { prefix = 'icon-', url = [] } = {}) {
    AIcon.prefix = prefix;
    url.forEach((scriptUrl) => {
      Icon.createFromIconfontCN({ scriptUrl });
    });
    Vue.component('a-icon', AIcon);
  },
};
