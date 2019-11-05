import Vue from 'vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import { configure, addParameters } from '@storybook/vue';
import VTextarea from '@comp/form/VTextarea.vue';

Vue.use(Antd);
Vue.component('v-textarea', VTextarea);

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