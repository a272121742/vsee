<template>
  <a-tooltip 
    v-bind="tooltip ? (tooltip === true ? {} : tooltip) : {}"
    class="ellipsis-wrap"
  >
    <template
      v-if="tooltip" 
      #title
    >
      <slot
        v-if="$slots.title"
        name="title"
      ></slot>
      <slot v-else></slot>
    </template>
    <span
      class="ellipsis-text"
    >
      {{ text | limit(length) }}
    </span>
  </a-tooltip>
</template>
<script>
export default {
  name: 'Ellipsis',
  filters: {
    limit (text = '', len = 0) {
      if (len) {
        return text.substr(0, len) + '...';
      } else {
        return text;
      }
    }, 
  },
  props: {
    length: {
      type: Number,
      default: 0
    },
    tooltip: {
      type: [Object, Boolean],
      default: () => ({})
    }
  },
  computed: {
    text () {
      return this.$slots.default.map(vNode => vNode.text).join('');
    }
  },
  created () {
    console.log(this.tooltip);
  }
};
</script>

<style lang="less" scoped>
  .ellipsis-wrap {
    overflow: hidden;
    position: relative;
  }
  .ellipsis-wrap::after {
    display: block;
    content: "...";
    /* 为三个省略号的宽度 */
    width: 1em;
    /* 使盒子不占位置 */
    margin-left: -1em;
    /* 移动省略号位置 */
    position: absolute;
  }
  .ellipsis-text {
    display: inline-block;
    word-break:break-all;
    width: inherit;
    height: inherit;
    overflow: hidden;
  }
</style>