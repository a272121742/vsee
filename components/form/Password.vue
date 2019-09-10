<template>
  <a-input
    class="clear-password"
    v-bind="$attrs"
    v-on="$listeners"
    :value="text"
    :type="type"
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
    <template>
      <a-icon
        slot="suffix"
        :type="type ? 'eye-invisible' : 'eye'"
        theme="filled"
        @click="changeInvisible"
      />
    </template>
  </a-input>
</template>

<script>
/**
 * 密码框
 */
export default {
  props: {
    /**
     * 必须定义，否则无法和`v-decorator`配合使用
     */
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
      type: 'password'
    }
  },
  beforeCreate () {
    // 必须删除
    delete this.$attrs.type;
  },
  methods: {
    /**
     * 清除
     */
    clear () {
      this.$emit('change', {target: {value: null}});
      this.text = null;
    },
    /**
     * 切换显隐
     */
    changeInvisible () {
      this.type = this.type ? '' : 'password';
    }
  }
}
</script>

<style lang="less" scoped>
  .clear-password {
    /deep/ .allow-clear {
      opacity: 0;
      margin-right: 12px;
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
