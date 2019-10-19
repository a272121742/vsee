Markdown笔记
======

这是一段笔记，源代码如下：

```javascript
storiesOf('插件|官方/Notes(笔记插件)', module)
  // .addDecorator(centered)
  .add('普通笔记', {
    template: '<span>看Notes笔记</span>'
  }, {
    notes
  })
  .add('HTML笔记', {
    render: h => <span>看控制台的笔记</span>
  }, {
    notes
  })
  .add('Markdown笔记', {
    render: h => <span>看控制台的笔记</span>
  }, {
    notes: {markdown: markdownNotes}
  });
```
