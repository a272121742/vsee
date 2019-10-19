import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';

import jsBaseMd from './docs/javascript-base.md';
import jsPerformanceMd from './docs/javascript-performance.md';

storiesOf('前端规范|开发规范/JavaScript', module)
  .addDecorator(centered)
  .add('基本原则', () => ({template: `<a>查看文档</a>`}), {notes: jsBaseMd})
  .add('性能优化', () => ({template: `<a>查看文档</a>`}), {notes: jsPerformanceMd});