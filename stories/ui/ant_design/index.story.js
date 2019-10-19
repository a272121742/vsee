import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import valuesMd from './docs/values.md';

storiesOf('设计规范|Ant Design', module)
  .addDecorator(centered)
  .add('价值观', () => ({
    template: `<a>点击查看笔记</a>`,
  }), {
    notes: valuesMd
  })