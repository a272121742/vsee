<template>
  <div class="container">
    <a-row
      class="row1 shadown-block-normal"
    >
      <a-card class="banner-card">
        <img
          slot="cover"
          src="/static/question/issue_banner.png"
        >
      </a-card>
    </a-row>
    <a-row
      class="row2 shadown-block-normal"
    >
      <home-block></home-block>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {
    HomeBlock: () => import('~/question/view/HomeBlock.vue')
  }
};
</script>

<style lang="less" scoped>
  .container {
    background-color: transparent!important;
    .row1 {
      margin: 16px 0;
      .banner-card {
        border-radius: 4px;
        border-radius: 4px;
        img {
          height: 220px;
          object-fit: cover;
        }
      }
    }
    .row2 {
      margin: 16px 0;
      background-color: #FFFFFF;
      padding: 8px 12px 0 12px;
      border-radius: 4px;
      border-radius: 4px;
    }
  }
  /deep/ .ant-form-item {
    display: flex;
  }
  /deep/ .ant-form-item-label {
    flex: .5;
  }
  /deep/ .ant-form-item-control-wrapper {
    flex: 1;
  }
  .ant-btn {
    margin-left: 12px;
  }
</style>
