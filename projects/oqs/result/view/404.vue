<template>
  <a-result
    status="404"
    title="404"
    :sub-title="$t('request.404')"
  >
    <template #extra>
      <a-button
        type="primary"
        @click="goHome"
      >
        {{ $t('action.go_home') }}
      </a-button>
      <a-button @click="goBack">
        {{ $t('action.back') }}
      </a-button>
    </template>
  </a-result>
</template>

<script>
import Vue from 'vue';
import { Result } from 'ant-design-vue';

Vue.use(Result);
export default {
  name: 'Error404',
  methods: {
    goBack () {
      this.$router.go(-1);
    },
    goHome () {
      this.$router.push('/');
    },
  },
};
</script>

<style lang="less">
</style>
