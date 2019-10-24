<template>
  <div class="container">
    <a-row
      class="row1 shadown-block-normal"
    >
      <a-card class="banner-card">
        <img
          slot="cover"
          src="/static/question/issue_banner.png"
        />
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
  .zoomImage {
    width:100%;
    height:100%;
    background-repeat: no-repeat;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
  }
  .container {
    background-color: transparent!important;
    .row1 {
      margin: 16px 0;
      .banner-card {
        border-radius: 4px;
        border-radius: 4px;
        img {
          width: 1200px;
          height: 220px;
          // object-fit: cover;
          // width:100%;
          // height:100%;
          background-size: cover;
          background-repeat:no-repeat;
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
