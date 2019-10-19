import { storiesOf } from '@storybook/vue';

const content = '切换故事的背景色';
storiesOf('插件|官方/Backgrounds(背景)', module)
  .addParameters({
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  })
  .add('故事1', () => {
    return {
      template: `<button>${content}</button>`,
    };
  })
  .add('故事2', () => {
    return {
      template: `<button>${content}</button>`,
    };
  });