<i18n>
  {
    "en": {
      "message": "Blocked twice commit, Please try it later!"
    },
    "zh": {
      "message": "已阻止二次提交，请稍后再试！"
    }
  }
</i18n>
<template>
  <a-button
    v-bind="$attrs"
    v-on="$listeners"
    :loading="loading"
    :disabled="disabled"
    @click.self.stop.prevent="handleClick"
  >
    <slot></slot>
  </a-button>
</template>

<script>
import untwice from '@mix/untwice.js';

export default {
  mixins: [untwice]
}
</script>
