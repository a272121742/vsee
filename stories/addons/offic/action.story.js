import { storiesOf } from '@storybook/vue';
import { action, actions, decorateAction } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/vue';

/**
 * 应用行为装饰器将多参数进行拦截，只返回首个参数
 */
const firstArgAction = decorateAction([args => {
  return args.slice(0, 1);
}]);

storiesOf('插件|官方/Actions(行为)', module)
  .addDecorator(centered)
  .add('单行为触发', () => ({
    template: '<button @click="log">点击触发事件</button>',
    methods: {
      log: action('单击事件'),
    },
  }))
  .add('多行为触发', () => ({
    template:
      '<button @click="click" @dblclick="doubleclick">单击/双击触发事件</button>',
    methods: actions('click', 'doubleclick'),
  }))
  .add('行为映射', () => ({
    template:
      '<button @click="click" @dblclick="doubleclick">单击/双击触发事件</button>',
    methods: actions({ click: '单击', doubleclick: '双击' }),
  }))
  .add('行为传参数', () => ({
    template: '<button @click="log">点击触发事件</button>',
    methods: {
      log: e => {
        e.preventDefault();
        action('单击参数：')(e.target);
      },
    },
  }))
  .add('参数拦截', () => ({
    template: '<button @click="log">点击触发事件</button>',
    methods: {
      log: e => {
        e.preventDefault();
        firstArgAction('拦截首参')('参数1，其他参数你看不到', e, e.target);
      }
    }
  }))
