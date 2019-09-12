<template>
  <a-layout id="components-layout-top-side">
    <!-- 头部，固定 -->
    <Header class="shadow-head"></Header>
    <!-- 内容区域 -->
    <a-spin :spinning="refreshing">
      <a-layout-content
        v-if="!refreshing"
        style="width: 100%;"
      >
        <div style="margin: 0 auto; max-width: 1200px;">
          <transition name="page-transition">
            <router-view />
          </transition>
        </div>
      </a-layout-content>
    </a-spin>
  </a-layout>
</template>

<script>
export default {
  components: {
    Header: () => import('./Header.vue')
  },
  data () {
    return {
    }
  },
  computed: {
    refreshing () {
      return this.$store.state.contentRefresh;
    }
  },
  created () {
    if (this.$store && this.$store.state) {
      // this.$store.dispatch('layout/getPermissions');
      Promise.all([
        this.$store.dispatch('layout/getPermissions'),
        this.$store.dispatch('layout/getUserInfo')
      ]);
    }
  },
  methods: {
    
  }
};
</script>

<style lang="less">
body {
  background: #f0f2f5;
}
.ant-layout-content {
  overflow-x: overlay;
}
#components-layout-top-side {
  height: 100%;
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
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
