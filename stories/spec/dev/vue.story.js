import { storiesOf, addParameters } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';

import vueGuideMd from './docs/vue-guide.md';
import restfulMd from './docs/vue-restful.md';


storiesOf('前端规范|开发规范/Vue', module)
  .addDecorator(centered)
  .add('编码指南', () => ({ template: `<a>查看文档</a>` }), { notes: vueGuideMd })
  .add('RESTFUL API', () => ({
    mounted: function () {
      addParameters({ options: { selectedPanel: 'VUE_STORYBOOK/knobs/panel' } });
    },
    template: `<a>查看文档</a>`
  }), { notes: restfulMd });
