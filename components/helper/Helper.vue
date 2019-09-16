<template>
  <a-affix
    :offset-top="top"
    :style="{ position: 'absolute', top: `${top}px`, right: '-12px'}"
  >
    <a-button
      type="primary"
      icon="setting"
      @click="e => visible = true"
    >
      配置
    </a-button>
    <a-drawer
      title="开发人员配置（生产环境不可见）"
      :width="720"
      :visible="visible"
      @close="e => visible = false"
    >
      开发人员专用
    </a-drawer>
  </a-affix>
</template>

<script>
export default {
  data () {
    return {
      top: 80,
      visible: false
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-btn {
    width: auto;
    margin-right: -38px;
    // opacity: 0.65;
    text-align: left;
    &:hover {
      // opacity: 1;
      margin-right: 0px;
    }
  }
  /deep/ .anticon {
    margin-left: -12px;
  }
</style>
