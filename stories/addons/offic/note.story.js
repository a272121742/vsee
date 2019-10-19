// 笔记插件 https://github.com/storybookjs/storybook/tree/master/addons/notes
import { storiesOf } from '@storybook/vue';
import centered from '@storybook/addon-centered/vue';
import readmeMarkdown from '../README.md';

// 新建一个笔记内容
const notes = `
  <pre>
  这是一段笔记，源代码如下：

  storiesOf('插件|官方/Notes(笔记插件)', module)
    .addDecorator(centered)
    .add('普通笔记', {
      template: '<span>看Notes笔记</span>'
    }, {
      notes
    })
    .add('HTML文本', {
      render: h => <span>看控制台的笔记</span>
    }, {
      notes
    });
  </pre>
`;

storiesOf('插件|官方/Notes(笔记)', module)
  .addDecorator(centered)
  .add('普通笔记', () => ({
    template: '<span>看Notes笔记</span>'
  }), {
    notes
  })
  .add('HTML笔记', () => ({
    render: h => <span>看控制台的笔记</span>
  }), {
    notes
  })
  .add('Markdown笔记', () => ({
    render: h => <span>看控制台的笔记</span>
  }), {
    notes: {markdown: readmeMarkdown}
  });