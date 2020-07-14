<template>
  <a-radio-group
    :value="value"
    size="small"
    button-style="solid"
    @change="updateLanguage"
  >
    <a-radio-button
      v-for="item in langs"
      :key="item.lang"
      :value="item.lang"
    >
      {{ item.text }}
    </a-radio-button>
  </a-radio-group>
</template>

<script>
import mixin from './mixin.js';

export default {
  mixins: [mixin],
  computed: {
    value () {
      return this.$store.state.local;
    },
  },
  methods: {
    updateLanguage (e) {
      const locale = this.locale[e.target.value];
      this.changeLanguage({ key: locale.lang }, { name: locale.name });
      this.$emit('change', { ...locale });
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .ant-radio-button-wrapper:last-child span {
    padding: 0 6px;
  }
</style>
