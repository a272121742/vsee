import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import readmeMarkdown from '../README.md';
import DocComp from './DocComp.vue';


storiesOf('插件|非官方/readme', module)
  .addDecorator(centered)
  .addParameters({
    readme: {
      sidebar: readmeMarkdown,
    }
  })
  .add('markdown', () => ({
    template: '<span>查看文档</span>'
  }))
  // .add('组件doc', () => ({
  //   components: { DocComp },
  //   render: (h) => <DocComp />
  // }), {
  //   readme: {
  //     content: DocComp.__docs
  //   }
  // })