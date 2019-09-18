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
        <div style="margin: 0 auto; max-width: 1200px;">
          <transition name="page-transition">
            <router-view class="child-view" />
          </transition>
        </div>
      </a-layout-content>
    </a-spin>
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
      this.$store.dispatch('layout/getMenus');
      this.$store.dispatch('layout/getPermissions');
      this.$store.dispatch('layout/getWorkflows');
      this.$store.dispatch('layout/getUserInfo');
    }
  }
};
</script>

<style lang="less" scoped>
  .ant-layout {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
  }
  /deep/ .ant-affix {
    z-index: 2147483647;
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
    transition: all .5s cubic-bezier(.55,0,.1,1);
  }
</style>
