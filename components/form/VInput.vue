<template>
  <a-input
    class="clear-input"
    v-bind="$attrs"
    v-on="$listeners"
    :value="text"
    @change="e => text = e.target.value"
    ref="input"
  >
    <!-- slot继承 -->
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
    <template v-if="allowClear">
      <a-icon
        v-show="text"
        class="allow-clear"
        slot="suffix"
        type="close-circle"
        theme="filled"
        @click="clear"
      />
    </template>
  </a-input>
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
    value: {
      type: String,
      default: undefined,
    },
    /**
     * 是否允许自动清除
     */
    allowClear: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const value = this.value || '';
    return {
      text: value,
    }
  },
  methods: {
    clear () {
      this.$emit('change', {target: {value: null}});
      this.text = null;
    }
  }
}
</script>

<style lang="less" scoped>
  .clear-input {
    /deep/ .allow-clear {
      opacity: 0;
    }
    &:hover {
      /deep/ .allow-clear {
          opacity: .3;
        &:hover {
          opacity: .8;
        }
      }
    }
  }
</style>
