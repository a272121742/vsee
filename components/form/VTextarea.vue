<template>
  <div class="clear-input">
    <a-textarea
      v-bind="$attrs"
      v-on="$listeners"
      :value="value"
    >
      <!-- slot继承 -->
      <template
        v-for="(_, slot) of $scopedSlots"
        v-slot:[slot]="scope"
      >
        <slot
          :name="slot"
          v-bind="scope"
        />
      </template>
    </a-textarea>
    <span
      v-if="allowClear"
      class="ant-input-suffix"
    >
      <a-icon
        slot="suffix"
        v-show="value"
        @click="$emit('change')"
        type="close-circle"
        theme="filled"
      />
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: undefined
    },
    allowClear: {
      type: Boolean,
      default: false
    }
  }
};
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
