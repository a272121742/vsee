import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';
import centered from '@storybook/addon-centered/vue';
import moment from 'moment';
import {
  withKnobs,
  text,
  number,
  boolean,
  array,
  select,
  color,
  date,
  button,
  object,
  radios,
  optionsKnob
} from '@storybook/addon-knobs';


import mdFull from '../docs/knobs.full.README.md';
import mdHead from '../docs/knobs0-head.README.md';
import mdIntr from '../docs/knobs0-introduction.README.md';
import md1 from '../docs/knobs1-text.README.md';
import md2 from '../docs/knobs2-boolean.README.md';
import md3 from '../docs/knobs3-select.README.md';
import md4 from '../docs/knobs4-number.README.md';
import md5 from '../docs/knobs5-color.README.md';
import md6 from '../docs/knobs6-object.README.md';
import md7 from '../docs/knobs7-array.README.md';
import md8 from '../docs/knobs8-date.README.md';
import md9 from '../docs/knobs9-array.README.md';

storiesOf('插件|官方/Knobs(旋钮)', module)
  .addDecorator(centered)
  .addDecorator(withKnobs)
  .addParameters({
    readme: {
      sidebar: mdFull
    }
  })
  .add('总览', () => ({template: '<p>查看下方文档</p>'}))
  .add('文本旋钮', () => ({
    props: {
      innerText: {default: text('innerText', '文本内容')}
    },
    template: `<a-button> {{ innerText }} </a-button>`
  }))
  .add('逻辑旋钮', () => ({
    props: {
      block: {default: boolean('block', false)},
      disabled: {default: boolean('disabled', false)},
      loading: {default: boolean('loading', false)},
      ghost: {default: boolean('ghost', false)}
    },
    template: `
      <a-button :block="block" :disabled="disabled" :loading="loading" :ghost="ghost">按钮</a-button>
    `
  }))
  .add('选择旋钮', () => ({
    props: {
      type: {default: select('type', ['primary', 'dashed', 'danger', 'ghost'], 'primary')},
      size: {default: select('size', ['small', 'default', 'large'], 'default')},
    },
    template: `<a-button :type="type" :size="size">按钮</a-button>`
  }))
  .add('数字旋钮', () => ({
    props: {
      percent: {default: number('percent', 50, {min: 0, max: 100, step: 1})}
    },
    template: `<a-progress :percent="percent"></a-progress>`
  }))
  .add('颜色旋钮', () => ({
    props: {
      twoToneColor: {default: color('twoToneColor', '#000000')}
    },
    template: `<a-icon type="heart" theme="twoTone" :twoToneColor="twoToneColor" />`
  }))
  .add('对象旋钮', () => ({
    props: {
      myStyle: {default: object('style', {
        background: 'blue',
        width: '100px',
        height: '40px'
      })}
    },
    template: `<a-card title="对象旋钮"><div :style="myStyle"></div></a-card>`
  }))
  .add('数组旋钮', () => ({
    props: {
      value: {default: array('value', ['标签1', '标签2', '标签3'])}
    },
    template: `<a-select mode="multiple" :value="value"></a-select>`
  }))
  .add('日期旋钮', () => ({
    props: {
      value: {default: moment(date('value', new Date()))}
    },
    template: `<a-calendar :fullscreen="false" :value="value"/>`,
  }))
  .add('按钮', () => ({
    render (h) {
      const btn = button('按钮', () => {
        console.log('执行其他函数，可用于改变其他旋钮的值，或提交ajax请求进行交互');
      });
      return (
        <a-button>按钮旋钮</a-button>
      )
    }
  }))
  .add('单选按钮', () => ({
    props: {
      type: {default: radios('type', ['primary', 'dashed', 'danger', 'ghost'], 'primary')},
      size: {default: radios('size', ['small', 'default', 'large'], 'default')},
    },
    template: `<a-button :type="type" :size="size">按钮</a-button>`
  }))
  .add('选项旋钮', () => ({
    props: {
      text: {default: optionsKnob('选项映射', {
        '多行单选': 'radio',
        '单行单选': 'inline-radio',
        '多行复选': 'check',
        '单行复选': 'inline-check',
        '下拉单选': 'select',
        '下拉多选': 'multi-select',
      }, 'radio', {
        display: 'inline-radio'
      })}
    },
    render (h) {
      return (
        <p>映射值： {this.text}</p>
      )
    }
  }))