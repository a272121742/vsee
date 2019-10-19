import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import proximityMd from './docs/proximity.md';
import alignmentMd from './docs/alignment.md';
import contrastMd from './docs/contrast.md';
import repetitionMd from './docs/repetition.md';

storiesOf('设计规范|Ant Design/设计原则', module)
  .addDecorator(centered)
  .add('亲密性', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: proximityMd
  })
  .add('对齐', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: alignmentMd
  })
  .add('对比', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: contrastMd
  })
  .add('重复', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: repetitionMd
  })