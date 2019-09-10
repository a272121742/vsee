<template>
  <a-radio-group 
    size="small" 
    :default-value="value" 
    buttonStyle="solid"
    @change="updateLanguage">
    <a-radio-button v-for="item in langs" :key="item.lang" :value="item.lang">
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
      const locale = this.$i18n ? this.$i18n.locale : 'cn';
      return locale;
    }
  },
  methods: {
    updateLanguage (e) {
      const locale = this.locale[e.target.value];
      this.changeLanguage({key: locale.lang}, {name: locale.name});
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>
