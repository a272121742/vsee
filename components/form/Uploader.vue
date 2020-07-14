<template>
  <a-upload
    :class="{'only-download-list': !$slots.default}"
    :file-list="value"
    v-bind="$options.exclude(['file-list'], $attrs)"
    v-on="$options.exclude(['change'], $listeners)"
    @change="onFileChange"
  >
    <slot></slot>
  </a-upload>
</template>

<script>
import { omit } from 'ramda';


export default {
  exclude: omit,
  model: {
    prop: 'value',
    event: 'change',
  },
  data () {
    return {
      value: null,
    };
  },
  methods: {
    onFileChange ({ fileList, event }) {
      console.log('files', fileList);
      if (fileList && fileList.length) {
        this.$emit('change', fileList, event);
      } else {
        this.$emit('change', null, event);
      }
      this.value = [...fileList];
    },
  },
};
</script>

<style lang="less" scoped>
.only-download-list {
  /deep/ .ant-upload-list .ant-upload-list-item {
    &:first-child {
      margin-top: 4px;
    }
    .anticon-paper-clip {
      top: 3px;
    }
    .anticon-close {
      display: none;
    }
  }
}
</style>
