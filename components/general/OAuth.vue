<template>
  <a-button
    v-if="!login_state"
    @click="toLogin"
  >
    OAuth登录
  </a-button>
</template>

<script>
import qs from 'qs';
import $ from '@http';

export default {
  data () {
    const uuid = this.$store.getters.getUUID();
    return {
      authorize: {
        client_id: 'fd4da8508c9878c3bc01',
        redirect_uri: 'http://localhost:8081/login',
        scope: 'read:user',
        state: uuid,
      },
      access_token: {
        client_id: 'fd4da8508c9878c3bc01',
        client_secret: 'ad4a218f4e78cf3e7dcdc7884c53d1d47e3b2fa6',
        code: '',
        redirect_uri: 'http://localhost:8081/login',
        state: uuid,
      },
      login_state: false,
    };
  },
  created () {
    const query = qs.parse(window.location.search);
    this.access_token.code = query.code;
    this.state = query.state;
    const data = this.access_token;
    $.request({
      url: '/oauth/login/oauth/access_token',
      type: 'post',
      data,
    }).then((res) => {
      console.log(res);
    });
  },
  methods: {
    toLogin () {
      console.log(qs.stringify(this.authorize));
      window.location.href = `https://github.com/login/oauth/authorize?${qs.stringify(this.authorize)}`;
    },
  },
};
</script>
