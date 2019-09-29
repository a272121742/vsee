<template>
  <a-layout>
    <!-- 头部，固定 -->
    <a-affix class="affix-header">
      <layout-header></layout-header>
    </a-affix>
    <!-- 内容区域 -->
    <transition name="page-transition">
      <a-spin :spinning="refreshing">
        <a-layout-content v-if="!refreshing">
          <div class="child-view">
            <router-view />
          </div>
        </a-layout-content>
      </a-spin>
    </transition>
    <!-- 开发辅助区域 -->
    <helper v-if="$store.state.isDev"></helper>
    <!-- 底部区域 -->
    <a-affix :offset-bottom="0">
      <a-layout-footer>
      </a-layout-footer>
    </a-affix>
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
  // 设置头部固定
  /deep/ .affix-header .ant-affix {
    z-index: 5000;
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, .2);
  }
  // 设置内容区域中，多余部分隐藏
  .ant-layout-content {
    overflow-x: hidden;
  }
  .ant-layout-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5000;
    text-align: center;
    padding: 8px 0;
    background-color: transparent!important;
  }
  // 设置英雄区域
  .child-view {
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    transition: all .5s cubic-bezier(.55,0,.1,1);
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
</style>
