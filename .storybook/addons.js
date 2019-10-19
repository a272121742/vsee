/**
 * npm i -D @storybook/addon-notes @storybook/addon-centered @storybook/addon-options @storybook/addon-knobs @storybook/addon-viewport storybook-readme @storybook/addon-storysource @storybook/theming raw-loader
 */

// 文档插件 https://github.com/tuchk4/storybook-readme
import 'storybook-readme/register';

// 旋钮插件 https://github.com/storybooks/storybook/tree/master/addons/knobs
import '@storybook/addon-knobs/register';
// 事件插件 https://github.com/storybooks/storybook/tree/master/addons/actions
import '@storybook/addon-actions/register';
// 链接插件 https://github.com/storybooks/storybook/tree/master/addons/links
import '@storybook/addon-links/register';
// 视图插件 https://www.npmjs.com/package/@storybook/addon-viewport
import '@storybook/addon-viewport/register';


import '@storybook/addon-storysource/register';
// 笔记插件 https://github.com/storybookjs/storybook/tree/master/addons/notes
import '@storybook/addon-notes/register';
// https://github.com/pocka/storybook-addon-vue-info
import 'storybook-addon-vue-info/lib/register'
// 背景插件
import '@storybook/addon-backgrounds/register';
import '@storybook/addon-a11y/register';
import '@storybook/addon-contexts/register';