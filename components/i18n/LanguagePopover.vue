<template>
  <a-popover class="language-popover">
    <a-menu
      slot="content"
      class="language-menu"
    >
      <a-menu-item
        v-for="item in langs"
        :key="item.lang"
        @click="(menu) => changeLanguage(menu, item)"
      >
        {{ item.text }}
      </a-menu-item>
    </a-menu>
    <a-button shape="circle">
      {{ lang }}
    </a-button>
  </a-popover>
</template>

<script>
import mixin from './mixin.js';

export default {
  components: {
    'a-popover': () => import('ant-design-vue/lib/popover'),
  },
  mixins: [mixin],
};
</script>

<style lang="less" scoped>
  .language-popover {
    /deep/ .ant-popover-inner-content {
      padding: 12px;
    }
  }
  .language-menu {
    border-right: none;
    /deep/ .ant-menu-item {
      height: 32px;
      line-height: 32px;
    }
  }
</style>
