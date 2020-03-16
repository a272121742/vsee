<template>
  <div class="app-header-wide">
    <span
      v-if="$store.state.isBuildTest"
      style="font-size: 18px; color:red; position: fixed; left: 50%; transform:translate(-50%, 0);"
    >
      {{ $t('project.testDesc') }}
    </span>
    <div class="header-comp">
      <div
        class="logo"
        type="iconlogo"
        @click="$store.dispatch('gohome')"
      >
      </div>
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
@header-height: 64px;
.app-header-wide {
  display: flex;
  height: 100%;
  margin: 0 16px;
  .header-comp {
    order: -1;
    .logo {
      display: inline-block;
      width: 140px;
      height: 32px;
      margin: 16px;
      background: rgba(233, 233, 233)
    }
    .ant-divider {
      top: -28px;
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
