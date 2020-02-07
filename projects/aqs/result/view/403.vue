<style lang="less">
  @import './403.less';
</style>

<template>
  <div class="error403">
    <div class="error403-body-con">
      <a-card>
        <div class="error403-body-con-title">
          <span class="error403-key-span">
            <a-icon
              size="220"
              type="lock"
            />
          </span>
        </div>
        <p class="error403-body-con-message">
          您似乎没有权限访问该页面！
        </p>
        <div class="error403-btn-con">
          <a-button
            size="large"
            style="width: 200px;"
            type="text"
            @click="goHome"
          >
            返回首页
          </a-button>
          <a-button
            size="large"
            style="width: 200px;margin-left: 40px;"
            type="primary"
            @click="goBack"
          >
            返回上一页
          </a-button>
        </div>
      </a-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error403',
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
