<template>
  <main>
    <a-row
      v-for="(block, index) in blocks"
      :id="block.fullPath"
      :key="index"
      class="content-child-view-item"
    >
      <div>
        <async-component
          v-if="block.componentPath"
          :path="block.componentPath"
        />
      </div>
    </a-row>
  </main>
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

<style lang="less" scoped>
.content-child-view-item {
  margin-bottom: 16px;
  background: #FFF;
  min-height: calc(100vh - @app-layout-header-height - @app-layout-footer-height - 32px);
}
</style>
