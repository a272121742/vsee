<template>
  <a-affix
    :offset-top="top"
    :style="{ position: 'fixed', top: `${top}px`, right: '0px'}"
  >
    <a-button
      type="primary"
      icon="setting"
      @click="show"
    >
      配置
    </a-button>
    <a-drawer
      title="开发人员配置（生产环境不可见）"
      :width="800"
      :visible="visible"
      @close="hide"
    >
      开发人员专用
      <async-component path="@comp/button/PreventButton">
        按钮
      </async-component>
    </a-drawer>
  </a-affix>
</template>

<script>
export default {
  components: {
    AsyncComponent: () => import('@comp/AsyncComponent')
  },
  data () {
    return {
      top: 80,
      visible: false
    }
  },
  methods: {
    show () {
      this.visible = true;
    },
    hide () {
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-btn {
    width: auto;
    margin-right: -50px;
    opacity: 0.65;
    text-align: left;
    &:hover {
      opacity: 1;
      margin-right: -10px;
    }
  }
  /deep/ .anticon {
    margin-left: -12px;
  }
</style>
