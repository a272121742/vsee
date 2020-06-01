<template>
  <div>
    <a-page-header
      title="容器固定"
      sub-title="避免因为加载时高度未固定而突然撑开布局"
    >
      <template slot="extra">
        <a-switch
          v-model="fixedContainerHeight"
          @change="loadData"
        />
      </template>
    </a-page-header>
    <FixedContainer
      ref="fixedContainerTable"
      :fixed="fixedContainerHeight"
      class="padding-left-24"
    >
    </fixedcontainer>
  </div>
</template>

<script>
export default {
  components: {
    FixedContainer: () => import('./FixedTable/FixedContainer.vue'),
  },
  data () {
    return {
      fixedContainerHeight: true,
    };
  },
  methods: {
    loadData () {
      const { fixedContainerTable } = this.$refs;
      fixedContainerTable && fixedContainerTable.fetch();
    },
  },
};
</script>
