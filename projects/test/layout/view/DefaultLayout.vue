<template>
  <a-layout>
    <!-- 头部，固定 -->
    <a-affix>
      <layout-header></layout-header>
    </a-affix>
    <!-- 内容区域 -->
    <a-spin :spinning="refreshing">
      <a-layout-content
        v-if="!refreshing"
        style="width: 100%;"
      >
        <transition name="page-transition">
          <router-view
            ref="routerView"
            class="child-view"
          />
        </transition>
      </a-layout-content>
    </a-spin>
    <a-affix class="helper-affix">
      <slot name="bottom-affix"></slot>
    </a-affix>
    <!-- 开发辅助区域 -->
    <helper v-if="$store.state.isDev"></helper>
  </a-layout>
</template>

<script>
export default {
  components: {
    LayoutHeader: () => import('./Header.vue'),
    Helper: () => import('@comp/helper/Helper.vue')
  },
  computed: {
    refreshing () {
      return this.$store.state.refresh;
    }
  },
  created () {
    if (this.$store) {
      // this.$store.dispatch('layout/getMenus');
      // this.$store.dispatch('layout/getPermissions');
      // this.$store.dispatch('layout/getWorkflows');
      // this.$store.dispatch('layout/getUserInfo');
    }
  }
};
</script>

<style lang="less" scoped>
  .ant-layout {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
  }
  // 设置头部固定
  /deep/ .affix-header .ant-affix {
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, .2);
  }
  // 设置所有的affix悬浮层次为5000
  /deep/ .ant-affix {
    z-index: 5000;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, .2);
  }
  .ant-layout-content {
    overflow-x: hidden;
  }
  /* 动画 */
  .page-transition-enter {
    opacity: 0;
  }
  .page-transition-leave-active {
    opacity: 0;
  }
  .page-transition-enter .page-transition-container,
  .page-transition-leave-active .page-transition-container {
    transform: scale(1.1);
  }
  .child-view {
    width: 1200px;
    margin: 0 auto;
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
</style>
