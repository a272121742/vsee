import { addParameters, configure, addDecorator } from '@storybook/vue';
import { addReadme } from 'storybook-readme/vue';
import { themes } from '@storybook/theming';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';


import Vue from 'vue';
import Vuex from 'vuex';
import i18n from 'vue-i18n';
// 加载本地组件
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css'
import { withA11y } from '@storybook/addon-a11y';
addDecorator(withA11y);

Vue.use(Antd);
Vue.use(Vuex);
Vue.use(i18n);
Vue.mixin({
  beforeCreate () {
    if (this.$i18n) {
      this.$i18n.locale = 'cn';
    }
  }
});
// 添加Readme
addDecorator(addReadme);

// 设置全部居中
// addDecorator(centered);

// 设置 全局信息展示
addParameters({
  docsContainer: DocsContainer,
  docs: DocsPage,
  options: {
    // name: 'vsee storybook',
    // url: '#',
    // 启用全屏
    isFullScreen: false,
    // 显示左侧故事导航
    showNav: true,
    // 显示插件面板
    showPanel: true,
    // 面板位置
    panelPosition: 'bottom',
    // 显示悬浮的搜索框
    showSearchBox: false,
    /**
     * 故事书的分隔符,正则表达式
     * @example:
     *   null - 关闭子故事
     *   /\// - 使用`/`分割
     *   /\./ - 使用`.`分割
     *   /\/|\./ - 使用`/`或`.`分割
     * @type {Regex}
     */
    hierarchySeparator: /\//,
    /**
     * 层级分隔符
     * @example:
     *   null - 关闭多层级，即多个根节点
     *   /\|/ - split by `|`
     * @type {Regex}
     */
    hierarchyRootSeparator: /\|/,
    // 启用动画
    sidebarAnimations: true,
    /**
     * 预先加载面板的ID
     * “addon panel”中的加载项顺序与在“addons.js”中导入它们的顺序相同。默认情况下，运行故事书时将打开第一个面板。
     * @type {String}
     */
    selectedPanel: undefined, //'REACT_STORYBOOK/readme/panel',
    /**
     * 启用快捷键
     * @type {Boolean}
     */
    enableShortcuts: true, // true by default
    /**
     * 显示工具栏
     * @type {Boolean}
     */
    isToolshown: true, // true by default

    
    
    /**
     * theme storybook, see link below
     */
    theme: {...themes.light, brandTitle: '模式库', brandUrl: '#'}
  }
});


configure(require.context('../story', true, /\.story\.(js|mdx)$/), module);
