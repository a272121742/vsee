<template>
  <div>
    <a-row
      v-for="(block, index) in blocks"
      :id="block.fullPath"
      :key="index"
      :style="{'paddingTop': index ? '0px' : '48px'}"
    >
      <div style="min-height: calc(100vh - 170px);">
        <async-component
          v-if="block.componentPath"
          :path="block.componentPath"
        />
      </div>
    </a-row>
  </div>
</template>

<script>
import { tree2list } from '@util/datahelper.js';

export default {
  computed: {
    blocks () {
      return tree2list(this.$store.state.routers.map((item) => ({ ...item })));
    },
  },
};
</script>
