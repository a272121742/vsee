<template>
  <div class="ant-list-item-meta-content">
    <h1 :class="{'ant-list-item-meta-title': true, 'ant-list-item-meta-title-center': !desc}">
      {{ title }}
    </h1>
    <div v-if="desc" class="ant-list-item-meta-description">
      {{ desc }}
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'desc']
}
</script>

<style lang="less" scoped>
  .ant-list-item-meta-content {
    margin: 16px;
    .ant-list-item-meta-title {
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 16px;
      line-height: 16px;
      color: #0097E0;
      margin: 0 0 4px 0;
    }
    .ant-list-item-meta-title-center {
      font-size: 16px;
      line-height: 32px;
      margin: 0;
    }
    .ant-list-item-meta-description {
      display: flex;
      justify-content: left;
      align-items: center;
      font-size: 12px;
      line-height: 12px;
      color: #0097E0;
    }
  }
  
</style>