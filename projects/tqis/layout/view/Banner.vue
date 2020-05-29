<template>
  <div class="header-banner">
    <div
      :class="{'ant-notification-notice-message': true, 'ant-notification-notice-message-center': !desc}"
    >
      {{ title }}
    </div>
    <div
      v-if="desc"
      class="ant-notification-notice-description"
    >
      {{ desc }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="less" scoped>
  .header-banner {
    padding: 16px;
  }
  .ant-notification-notice-message {
    display: block;
    font-size: 16px;
    line-height: 1;
    font-weight: bold;
    color: #0097E0;
    margin: 0 0 4px 0;
  }
  .ant-notification-notice-message-center {
    line-height: 32px;
    margin: 0;
  }
  .ant-notification-notice-description {
    font-weight: bold;
    font-size: 12px;
    line-height: 1;
    color: #0097E0;
  }
</style>
