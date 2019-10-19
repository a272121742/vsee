import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import getStartedMd from './docs/get-started.md';
import simpleComponentMd from './docs/simple-component.md';
import compositeComponent from './docs/composite-component.md';
import dataMd from './docs/data.md';
import screenMd from './docs/screen.md';
import testMd from './docs/test.md';
import deployMd from './docs/deploy.md';
import conclusionMd from './docs/conclusion.md';
import contributeMd from './docs/contribute.md';

storiesOf('框架指引|相关教程/StoryBook', module)
  .addDecorator(centered)
  .add('起步', () => ({template: `<a>查看文档</a>`}), {notes: getStartedMd})
  .add('简单组件', () => ({template: `<a>查看文档</a>`}), {notes: simpleComponentMd})
  .add('合成组件', () => ({template: `<a>查看文档</a>`}), {notes: compositeComponent})
  .add('数据', () => ({template: `<a>查看文档</a>`}), {notes: dataMd})
  .add('页面', () => ({template: `<a>查看文档</a>`}), {notes: screenMd})
  .add('测试', () => ({template: `<a>查看文档</a>`}), {notes: testMd})
  .add('发布', () => ({template: `<a>查看文档</a>`}), {notes: deployMd})
  .add('总结', () => ({template: `<a>查看文档</a>`}), {notes: conclusionMd})
  .add('帮助', () => ({template: `<a>查看文档</a>`}), {notes: contributeMd})