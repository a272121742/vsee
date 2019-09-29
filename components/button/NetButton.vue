<template>
  <a-button
    ref="button"
    v-bind="$attrs"
    :loading="loading"
    v-on="$listeners"
    @click="handleAjax"
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
};

</script>
