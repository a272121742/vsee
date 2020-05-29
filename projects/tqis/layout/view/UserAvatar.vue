<template>
  <a-dropdown
    :trigger="['click']"
    :get-popup-container="e => e.parentNode"
    class="user-info"
  >
    <div class="user-info-awatar">
      <a-icon type="icontx_outlined"></a-icon>
      <change-password
        :visible.sync="showChangePassword"
        :mapping="{ oldPassword: 'password', newPassword: 'newPassword'}"
        url="/sys/user/password"
      >
      </change-password>
      {{ user.realName }}
    </div>
    <a-menu slot="overlay">
      <a-menu-item key="0">
        <a @click="downloadFromStatic($t('download.user_manual'))">
          {{ $t('action.manual') }}
        </a>
      </a-menu-item>
      <a-menu-item key="1">
        <a @click="toChangePd">
          {{ $t('password.title') }}
        </a>
      </a-menu-item>
      <a-menu-item key="2">
        <a @click.stop.prevent="toPortal">
          {{ $t('action.toPortal') }}
        </a>
      </a-menu-item>
      <a-menu-item key="3">
        <a @click.stop.prevent="logoutHandle">
          {{ $t('action.logout') }}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import attachment from '~~/attachment.js';

export default {
  components: {
    ChangePassword: () => import('@comp/general/ChangePassword.vue'),
  },
  mixins: [attachment],
  data () {
    return {
      showChangePassword: false,
    };
  },
  computed: {
    user () {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    toPortal () {
      this.$store.dispatch('gohome');
    },
    toChangePd () {
      this.showChangePassword = true;
    },
    logoutHandle () {
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
