import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';

import baseMd from './docs/base.md';
import eslintMd from './docs/eslint.md';


storiesOf('前端规范|开发规范', module)
  .addDecorator(centered)
  .add('基本原则', () => ({ template: `<a>查看文档</a>` }), { notes: baseMd })
  .add('ESLint', () => ({ template: `<a>查看文档</a>` }), { notes: eslintMd });
