<template>
  <div>
    <a-page-header
      title="紧凑模式"
      sub-title="搜索表单无需校验时可采用紧凑模式缩减空间"
    >
      <template slot="extra">
        <a-button>查看源码</a-button>
        <a-switch v-model="compact" />
      </template>
    </a-page-header>
    <ColumnCompact
      class="padding-left-24"
      :compact="compact"
    />
    <a-page-header
      title="分列布局"
      sub-title=""
    >
    </a-page-header>
    <ColumnSplit class="padding-left-24" />
    <a-page-header
      title="列对齐"
      sub-title=""
    >
      <template slot="extra">
        <a-switch v-model="align" />
      </template>
    </a-page-header>
    <ColumnAlign
      class="padding-left-24"
      :align="align"
    />
  </div>
</template>

<script>
export default {
  components: {
    ColumnCompact: () => import('./FormLayout/ColumnCompact.vue'),
    ColumnSplit: () => import('./FormLayout/ColumnSplit.vue'),
    ColumnAlign: () => import('./FormLayout/ColumnAlign.vue'),
  },
  data () {
    return {
      compact: true,
      align: true,
    };
  },
};
</script>
