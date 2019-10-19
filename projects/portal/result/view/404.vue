<template>
  <div class="error404">
    <div class="error404-body-con">
      <a-card>
        <div class="error404-body-con-title">
          404
        </div>
        <p class="error404-body-con-message">
          您所查找的页面已丢失！
        </p>
        <div class="error404-btn-con">
          <a-button
            @click="goHome"
            size="large"
            style="width: 200px;"
          >
            返回首页
          </a-button>
          <a-button
            @click="goBack"
            size="large"
            style="width: 200px;margin-left: 40px;"
            type="primary"
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
  name: 'Error404',
  methods: {
    goBack () {
      this.$router.go(-1);
    },
    goHome () {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="less">
@import "404.less";
</style>
