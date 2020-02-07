<template>
  <a-dropdown
    :trigger="['click']"
    :get-popup-container="e => e.parentNode"
    class="user-info"
  >
    <div class="user-info-awatar">
      <v-icon type="icontx_outlined"></v-icon>
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
export default {
  components: {
    ChangePassword: () => import('@comp/general/ChangePassword.vue'),
  },
  data () {
    return {
      form: null,
      visible: false,
      record: {},
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
      window.location.replace(this.$store.state.isProd ? '/portal' : '/');
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
    padding: 0 16px;
    cursor: pointer;
    &:hover {
      background-color: #e6fbff;;
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
  }
</style>
