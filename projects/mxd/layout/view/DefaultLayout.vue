<template>
  <a-layout style="height: 100%; max-height: 960px; min-height: 720px;">
    <!-- 头部，固定 -->
    <div style="z-index:6000;position:absolute;width:100%;margin:auto;">
      <layout-header></layout-header>
    </div>
    <div class="test-env">
      <h2 
        v-if="$store.state.isBuildTest"
        style="color:red;"
      >
        <!-- 测试环境 -->
        {{ $t('env.name') }}
      </h2>
    </div>
    <a-layout style="margin-top: 64px; height: 100%;">
      <a-layout-sider
        width="200"
        style="background: #fff"
      >
        <a-menu
          mode="inline"
          theme="dark"
          :default-selected-keys="['1']"
          :default-open-keys="['sub1']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu key="sub1">
            <span slot="title"><a-icon type="user" />subnav 1</span>
            <a-menu-item key="1">
              option1
            </a-menu-item>
            <a-menu-item key="2">
              option2
            </a-menu-item>
            <a-menu-item key="3">
              option3
            </a-menu-item>
            <a-menu-item key="4">
              option4
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="laptop" />subnav 2</span>
            <a-menu-item key="5">
              option5
            </a-menu-item>
            <a-menu-item key="6">
              option6
            </a-menu-item>
            <a-menu-item key="7">
              option7
            </a-menu-item>
            <a-menu-item key="8">
              option8
            </a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub3">
            <span slot="title"><a-icon type="notification" />subnav 3</span>
            <a-menu-item key="9">
              option9
            </a-menu-item>
            <a-menu-item key="10">
              option10
            </a-menu-item>
            <a-menu-item key="11">
              option11
            </a-menu-item>
            <a-menu-item key="12">
              option12
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px; height: 100%;">
        <helper></helper>
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          style="margin: 0; height: 100%;"
        >
          <a-spin :spinning="refreshing">
            <a-layout-content v-if="!refreshing">
              <div class="child-view">
                <router-view />
              </div>
            </a-layout-content>
          </a-spin>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  components: {
    LayoutHeader: () => import('./Header.vue'),
    Helper: () => import('@comp/helper/Helper.vue')
  },
  // data () {
  //   return {
  //     blocking: true
  //   };
  // },
  computed: {
    refreshing () {
      return this.$store.state.refresh;
    },
    reloading () {
      return this.$store.state.reload;
    }
  },
  watch: {
    reloading: {
      handler (value) {
        !value && this.init();
      },
      immediate: true
    }
  },
  methods: {
    init () {
      this.$store.dispatch('fetchUser').then(() => {
        this.$store.dispatch('fetchPermissions');
        this.blocking = false;
      }).catch(err => {
        err && this.$message.error(this.$t(err));
      });
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
  /deep/ .affix-header {
    height: 64px;
    z-index: 6000;
  }
  // 设置内容区域中，多余部分隐藏
  .ant-layout-content {
    overflow-x: hidden;
    
  }
  .ant-spin-nested-loading {
    height: 100%;
    /deep/ .ant-spin-container {
      height: 100%;
    }
  }
  .ant-layout-content, .child-view {
    height: 100%;
  }
  .ant-layout-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 6000;
    text-align: center;
    padding: 8px 0;
    background-color: transparent!important;
  }
  // 设置英雄区域
  .child-view {
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
  .test-env {
    z-index:6000;
    position:fixed;
    width:360px;
    margin:0 auto;
    left:0;
    padding-left:calc(100vw - 100%);
    right:40px;
    text-align: center;
    height:64px;
    line-height:64px;
  }
</style>
