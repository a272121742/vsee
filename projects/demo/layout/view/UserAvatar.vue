<template>
  <a-dropdown
    :trigger="['click']"
    :get-popup-container="e => e.parentNode"
    class="user-info"
  >
    <div class="user-info-awatar">
      <a-icon type="icontx_outlined"></a-icon>
      {{ user.realName }}
    </div>
    <a-menu slot="overlay">
      <a-menu-item key="gohome">
        <a @click.stop.prevent="gohome">
          {{ $t('action.go_home') }}
        </a>
      </a-menu-item>
      <a-menu-item key="logout">
        <a @click.stop.prevent="logout">
          {{ $t('action.logout') }}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.user;
    },
  },
  methods: {
    gohome () {
      this.$store.dispatch('gohome');
    },
    logout () {
      this.$store.dispatch('logout');
    },
  },
};
</script>

<style lang="less" scoped>
  .user-info {
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.09);
    }
  }
  .user-info-awatar {
    .anticon {
      vertical-align: middle;
      font-size: 24px;
      color: @text-color;
      margin: auto 8px;
    }
    font-size: 14px;
    color: @text-color;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: keep-all;
  }
</style>
