<template>
  <a-tree-select
    ref="treeSelect"
    v-bind="$attrs"
    :value="value"
    :tree-data="data"
    v-on="$listeners"
  >
  </a-tree-select>
</template>

<script>
import fetch from '@mix/fetch.js';

export default {
  props: {
    /**
     * 是否缓存
     */
    cache: {
      type: Boolean,
      default: true
    },
    /**
     * 是否延时，即在点击之后加载
     */
    delay: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /**
       * 数据项
       */
      data: []
    }
  },
  created () {
    const { url, delay } = this;
    url && !delay && this.fetch();
    this.data = this.$attrs.treeData || [];
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
