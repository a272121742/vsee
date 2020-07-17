<template>
  <i
    v-if="isCustom"
    :class="['a-icon', 'anticon', `a-${type}`]"
    :aria-label="`自定义图标：${type}`"
    v-bind="$props"
    v-on="$listeners"
  >
    <svg
      width="1em"
      height="1em"
      fill="currentColor"
      :data-icon="type"
      focusable="false"
      aria-hidden="true"
    >
      <use :xlink:href="`#${type}`" />
    </svg>
  </i>
  <ant-icon
    v-else
    class="a-icon"
    v-bind="$props"
    v-on="$listeners"
  ></ant-icon>
</template>

<script>
import { Icon } from 'ant-design-vue';

export default {
  components: {
    AntIcon: Icon,
  },
  props: Icon.props,
  computed: {
    isCustom () {
      return this.type && String.prototype.startsWith.call(this.type, this.$options.prefix);
    },
  },
};
</script>
