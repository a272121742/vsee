<template>
  <a-button
    v-bind="$attrs"
    :loading="loading"
    :disabled="disabled"
    v-on="$listeners"
    @click.self.stop.prevent="handleClick"
  >
    <!-- slot继承 -->
    <slot></slot>
    <!-- <template
      v-for="(_, slot) of $scopedSlots"
      v-slot:[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template> -->
  </a-button>
</template>

<script>
import untwice from '@mix/untwice.js';

export default {
  mixins: [untwice],
};
</script>
