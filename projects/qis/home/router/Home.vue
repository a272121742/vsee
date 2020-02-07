<template>
  <div class="container">
    <a-row
      :gutter="16"
      class="row1 "
    >
      <a-col :span="6">
        <published-doughnut-block></published-doughnut-block>
      </a-col>
      <a-col :span="6">
        <champion-doughnut-block></champion-doughnut-block>
      </a-col>
      <a-col :span="12">
        <overday-issue-block></overday-issue-block>
      </a-col>
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
    PublishedDoughnutBlock: () => import('../view/PublishedDoughnutBlock.vue'),
    ChampionDoughnutBlock: () => import('../view/ChampionDoughnutBlock.vue'),
    OverdayIssueBlock: () => import('../view/OverdayIssueBlock.vue'),
    HomeBlock: () => import('~/question/view/HomeBlock.vue'),
  },
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
      background-color: transparent!important;
      margin: 16px 0;
      .ant-card {
        box-shadow: 0 2px 6px 0 rgba(0, 0, 0, .12)!important;
      }
      .banner-card {
        border-radius: 4px;
        border-radius: 4px;
        img {
          width: 1200px;
          height: 220px;
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
