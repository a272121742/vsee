<template>
  <div class="app-header-wide">
    <span
      v-if="$store.state.isBuildTest"
      style="font-size: 18px; color:red; position: fixed; left: 50%; transform:translate(-50%, 0);"
    >
      {{ $t('env.name') }}
    </span>
    <div class="header-comp">
      <v-icon
        class="logo"
        type="iconlogo"
        @click="$store.dispatch('gohome')"
      />
      <a-divider
        type="vertical"
      ></a-divider>
      <Banner
        class="banner"
        title="模块名称"
      />
    </div>
    <div
      class="header-nav"
    >
      <NavMenu v-if="false" />
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
    Banner: () => import('@comp/head/Banner.vue'),
    NavMenu: () => import('./NavMenu.vue'),
  },
};
</script>

<style lang="less" scoped>
@header-height: 64px;
.app-header-wide {
  display: flex;
  height: 100%;
  margin: 0 16px;
  .header-comp {
    order: -1;
    .logo {
      color: @primary-color;
      font-size: 168px;
      cursor: pointer;
      margin: 0 12px;
      svg {
        height: @header-height;
      }
    }
    .ant-divider {
      top: -4px;
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
    padding-left: 200px;
  }
  .header-user {
    flex-basis: 180px;
    overflow: hidden;
  }
}
</style>
