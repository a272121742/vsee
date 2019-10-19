import { storiesOf } from '@storybook/vue';

import { withInfo } from 'storybook-addon-vue-info';
import centered from '@storybook/addon-centered/vue';
import { Button as AButton } from 'ant-design-vue';

storiesOf('插件|非官方/Infos', module)
  .addDecorator(centered)
  .addDecorator(withInfo)
  .add('渗透组件', () => ({
    components: {AButton},
    template: '<a-button>按钮</a-button>'
  }), {
    info: {}
  })
  .add('自定义文档', () => ({
    components: {AButton},
    template: '<a-button>按钮</a-button>'
  }), {
    info: `
      # 这是文档说明
      
      你这可以自定义文档
    `
  })
  .add('混合模式', () => ({
    components: {AButton},
    template: '<a-button>按钮</a-button>'
  }), {
    info: {
      summary: `
        # 你可以混合这两种模式
      `,
      compponents: {AButton}
    }
  })