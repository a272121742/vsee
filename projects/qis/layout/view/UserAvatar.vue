<template>
  <a-dropdown
    :trigger="['click']"
    :get-popup-container="e => e.parentNode"
    class="user-info"
  >
    <div>
      <v-icon
        class="avatar-logo"
        type="icontx_outlined"
      ></v-icon>
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
          {{ $t('user_action.manual') }}
        </a>
      </a-menu-item>
      <a-menu-item key="1">
        <a @click="toChangePd">
          {{ $t('user_action.change_pd') }}
        </a>
      </a-menu-item>
      <a-menu-item key="2">
        <a @click.stop.prevent="toPortal">
          {{ $t('user_action.to_portal') }}
        </a>
      </a-menu-item>
      <a-menu-item key="3">
        <a @click.stop.prevent="logoutHandle">
          {{ $t('user_action.logout') }}
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import attachment from '~~/issue-attachment.js';

export default {
  components: {
    ChangePassword: () => import('@comp/general/ChangePassword.vue'),
  },
  mixins: [attachment],
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
<style>
.avatar-logo {
  height: 24px;
  vertical-align: -0.3em;
  font-size:24px;
}
.user-info {
  cursor: pointer;
}
</style>
