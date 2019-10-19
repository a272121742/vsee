import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import fontMd from './docs/font.md';
import colorMd from './docs/color.md';
import layoutMd from './docs/layout.md';

storiesOf('设计规范|BTQIS/视觉设计', module)
  .addDecorator(centered)
  .add('字体', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: fontMd
  })
  .add('颜色', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: colorMd
  })
  .add('布局', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: layoutMd
  })