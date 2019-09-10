/* eslint-disable eol-last */
<template>
  <div class="clear-input">
    <a-textarea
      v-bind="$attrs"
      v-on="$listeners"
      ref="input"
      @change="e => value = e.target.value"
    >
    </a-textarea>
    <span
      v-if="allowClear"
      class="ant-input-suffix"
    >
      <a-icon
        v-show="value"
        slot="suffix"
        type="close-circle"
        theme="filled"
        @click="clear"
      />
    </span>
  </div>
</template>

<script>
/**
 * input focus时
 * 1. 如果文本为空，不显示close
 * 2. 如果文本不为空，显示普通close
 * close foucs时
 * 1. 显示黑色close
 */
export default {
  props: {
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      value: ''
    }
  },
  mounted () {
    this.value = this.$refs.input.stateValue;
  },
  methods: {
    clear () {
      this.$refs.input.stateValue = null;
      this.value = null;
    }
  }
}
</script>

<style lang="less" scoped>
  .clear-input {
    position: relative;
    /deep/ .ant-input-suffix {
      position: absolute;
      bottom: 1px;
      right: 14px;
      opacity: 0;
    }
    &:hover {
      /deep/ .ant-input-suffix {
          opacity: .3;
        &:hover {
          opacity: .6;
        }
      }
    }
  }
</style>
