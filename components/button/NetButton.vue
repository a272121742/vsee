<template>
  <a-button
    v-bind="$attrs"
    v-on="$listeners"
    @click="handleAjax"
    :loading="loading"
    ref="button"
  >
    <slot></slot>
  </a-button>
</template>

<script>
import $ from '@lib/ajax';
import fetch from '@mix/fetch.js';

export default {
  mixins: [fetch],
  created () {
    this.loading = this.$attrs.loading;
  },
  methods: {
    handleAjax () {
      this.fetch();
    }
  }
}

</script>
