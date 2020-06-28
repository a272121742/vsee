<template>
  <div class="app-header-wide">
    <span
      v-if="$store.state.isBuildTest"
      style="font-size: 18px; color:red; position: fixed; left: 50%; transform:translate(-50%, 0);"
    >
      {{ $t('project.testDesc') }}
    </span>
    <div class="header-comp">
      <a-icon
        class="logo"
        type="icon-logo"
        @click="$store.dispatch('gohome')"
      />
      <a-divider
        type="vertical"
      ></a-divider>
      <Banner
        class="banner"
        :title="$t('project.title')"
        :desc="$te('project.desc') ? $t('project.desc') : ''"
      />
    </div>
    <div
      class="header-nav"
    >
      <slot name="nav"></slot>
    </div>
    <div class="header-user">
      <UserAvatar />
    </div>
  </div>
</template>

<script>
export default {
  components: {
    UserAvatar: () => import('./UserAvatar.vue'),
    Banner: () => import('./Banner.vue'),
  },
};
</script>

<style lang="less" scoped>
@header-height: @app-layout-header-height;
@nav-wdith: 200px;
.app-header-wide {
  display: flex;
  margin: 0 16px;
  .header-comp {
    order: -1;
    .logo {
      color: @primary-color;
      margin: auto 16px;
      font-size: 168px;
      cursor: pointer;
      /deep/ svg {
        height: 64px;
      }
    }
    .ant-divider {
      top: -8px;
      background: @primary-color;
    }
    .banner {
      display: block;
      float: right;
    }
  }
  .header-nav {
    flex-grow: 1;
    overflow: hidden;
    padding-left: @nav-wdith;
  }
  .header-user {
    flex-basis: @nav-wdith;
    overflow: hidden;
  }
}
</style>
