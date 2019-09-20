<template>
  <a-button
    ghost
    shape="circle"
    type="primary"
    icon="reload"
    @click="refresh"
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
  </a-button>
</template>

<script>
import untwice from '@mix/untwice.js';

export default {
  mixins: [untwice],
  methods: {
    refresh () {
      this.$store.dispatch('refresh');
    }
  }
}
</script>
