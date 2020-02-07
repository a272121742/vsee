<template>
  <a-form>
    <a-form-item
      label="编号"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      1111
    </a-form-item>
    <a-form-item
      label="中文名称"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      中文名称
    </a-form-item>
    <a-form-item
      label="英文名称"
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
    >
      english name
    </a-form-item>
    <a-affix style="position: absolute; right: 16px; top: 16px;">
      <a-button
        class="node-detail-action node-detail-action-update"
        type="primary"
      >
        修改
      </a-button>
      <a-button
        class="node-detail-action node-detail-action-delete"
        type="danger"
      >
        删除
      </a-button>
    </a-affix>
  </a-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
      },
    };
  },
};
</script>

<style lang="less" scoped>
  .ant-form {
    padding: 16px;
    /deep/ .ant-form-item {
      // 调整表单行行高，使其紧凑
      margin-bottom: 0;
      // 调整表单行行高，使其紧凑
      /deep/ .ant-form-item-label, /deep/ .ant-form-item-control {
        line-height: 28px;
      }
    }
    .node-detail-action {
      margin-right: 8px;
    }
  }

</style>
