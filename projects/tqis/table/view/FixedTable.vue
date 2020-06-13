<template>
  <div>
    <a-page-header
      title="容器固定"
      sub-title="避免因为加载时高度未固定而突然撑开布局"
    >
      <template slot="extra">
        返回空
        <a-switch
          v-model="fixedContainerDataEmpty"
          @change="loadData"
        />
        固定高
        <a-switch
          v-model="fixedContainerHeight"
          @change="loadData"
        />
        <a-button @click="loadData">
          加载
        </a-button>
      </template>
    </a-page-header>
    <FixedContainer
      ref="fixedContainerTable"
      :empty="fixedContainerDataEmpty"
      :fixed="fixedContainerHeight"
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
      fixedContainerDataEmpty: false,
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
