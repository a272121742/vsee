# 构建一个简单的组件

我们将按照[组件驱动开发](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) 方法论来 构建我们的UI. 这是一个从"自下而上"开始构建UI的过程,从组件开始到整个页面结束. CDD 可帮助您在构建UI时,摆列您所面临的复杂程度. 

## 任务-Task

![Task component in three states](https://www.learnstorybook.com/task-states-learnstorybook.png)

`Task`是我们的应用程序的核心组件. 每个任务的显示略有不同,具体取决于它所处的`状态-state`. 我们显示一个选中 (或未选中) 复选框,一些有关任务的信息,以及一个"pin"按钮,允许我们在列表中上下移动任务. 为了把各个它们摆在一起,我们需要下面的 **props**: 

-   `title` - 描述任务的字符串

-   `state` - 哪个列表是当前的任务,是否已检查?

在我们开始构建`Task`时,我们首先编写 与 上面草图中不同类型的任务 相对应的测试状态. 然后我们使用 Storybook 模拟数据 隔离对应状态组件. 我们将"视觉测试"组件在每个状态下的外观. 

这个过程类似于[测试驱动的开发(TDD)](https://en.wikipedia.org/wiki/Test-driven_development),我们可以称之为["Visual-虚拟 TDD"](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)

## 获取设置

首先,让我们创建任务组件 及 其附带的 *storybook-故事* 文件: 

`src/components/Task.vue`和`src/components/Task.stories.js`

我们将从基本实现开始,简单传入我们需要的`属性-props` : 

```html
<template>
  <div class="list-item">
    <input type="text" :readonly="true" :value="this.task.title" />
  </div>  
</template>

<script>
export default {
  name: "task",
  props: {
    task: {
      type: Object,
      required: true
    }
  }
};
</script>
```

上面,我们基于 Todos应用程序现有HTML结构 为 `Task`提供简单的 markup . 

下面, 我们在 故事文件中 构建 Task的 三个测试状态: 


```javascript
import { storiesOf } from '@storybook/vue';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const methods = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task }),
      methods,
    };
  })
  .add('pinned', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_PINNED' } }),
      methods,
    };
  })
  .add('archived', () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: 'TASK_ARCHIVED' } }),
      methods,
    };
  });
```

Storybook中有两个基本的组织级别. 

该组件 及 其 child 故事. 

将每个故事 视为组件的排列. 您可以根据需要为每个组件 创建 尽可能多的故事. 

-   **组件**
    -   故事
    -   故事
    -   故事

要开始 Storybook,我们先运行注册组件的`storiesOf()`函数. 我们为组件添加 *显示名称 -  Storybook应用程序侧栏上显示的名称*. 

`action()`允许我们创建一个回调, 当在Storybook UI的面板中 单击这个 **action** 时回调触发. 因此,当我们构建一个pin按钮时,我们将能够在测试UI中确定按钮单击是否成功. 

由于我们需要将同一组操作传递给组件的所有排列，因此将它们捆绑到单个`methods`中是很方便的，并且每次将它们传递到我们的`story`定义中（通过`methods`属性访问它们）.

关于捆绑`methods`的另一个好处就是,你可以`export`它们,用于重用该组件的组件,我们稍后会看到. 

为了定义我们的故事,我们用`add()`,一次一个为我们的每个测试状态生成一个故事. `add`第二个参数是一个函数,它返回一个给定状态的渲染元素 (即带有一组`props`的组件类)  - 就像一个Vue组件一样. 

在创建故事时,我们使用基本任务 (`task`) 构建组件期望的 任务的形状. 这通常是 根据真实数据的模型建模的. 再次,正如我们所看到的,`export`这种形状将使我们能够在以后的故事中重复使用它. 

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> 帮助您在隔离构建UI组件时 验证交互. 通常，您无法访问应用程序上下文中的函数和状态。 使用 <code>action()</code> 将它们存入.
</div>

## 配置

我们还必须对 Storybook的配置设置 (`.storybook/config.js`) 做一个小改动,让它注意到我们的`.stories.js`文件并使用我们的CSS文件. 默认情况下, Storybook 会查找故事`/stories`目录; 本教程使用类似于`.test.js`的命名方案, 这个命令是 **CRA** 赞成的用于自动化测试的方案. 

```javascript
import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

完成此操作后,重新启动 Storybook服务器 应该会产生 三个任务状态的测试用例: 

<video autoPlay muted playsInline controls style="width: 100%">
  <source
    src="https://www.learnstorybook.com/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## 建立状态

现在我们有 Storybook设置,导入的样式和构建的测试用例,我们可以快速开始实现组件的HTML,以匹配设计. 

该组件目前仍然是基本的. 首先编写实现设计的代码,不用过多细节: 

```javascript
<template>
  <div :class="taskClass">
    <label class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="true"
        name="checked"
      />
      <span class="checkbox-custom" @click="$emit('archiveTask', task.id)"/>
    </label>
    <div class="title">
      <input type="text" :readonly="true" :value="this.task.title" placeholder="Input title" />
    </div>
    <div class="actions">
      <a @click="$emit('pinTask', task.id)" v-if="!isChecked">
        <span class="icon-star"/>
      </a>
    </div>
  </div>  
</template>

<script>
export default {
  name: "task",
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    taskClass() {
      return `list-item ${this.task.state}`;
    },
    isChecked() {
      return this.task.state === "TASK_ARCHIVED";
    }
  }
};
</script>
```

上面的附加 markup 与我们之前导入的CSS相结合,产生以下UI: 

<video autoPlay muted playsInline loop style="width: 100%">
  <source
    src="https://www.learnstorybook.com/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with less bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because Storybook is a quick way to view the new version of a component and visualize the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding a development dependency on the package:

```bash
yarn add --dev @storybook/addon-storyshots jest-vue-preprocessor babel-plugin-require-context-hook
```

Then create a `tests/unit/storybook.spec.js` file with the following in it:

```javascript
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import initStoryshots from '@storybook/addon-storyshots';

registerRequireContextHook();
initStoryshots();
```

We need to add a line to our `jest.config.js`:

```js
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
```

Finally, we need to make a tweak to our `babel.config.js`:

```js
module.exports = api => ({
  presets: ['@vue/app'],
  ...(api.env('test') && { plugins: ['require-context-hook'] }),
});
```

Once the above is done, we can run `yarn test:unit` and see the following output:

![Task test runner](https://www.learnstorybook.com/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.
