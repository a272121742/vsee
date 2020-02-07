<template>
  <div class="container shadown-block-normal">
    <!-- 搜索表单 -->
    <advance-search-form
      v-permission="'issue:advance:search'"
      @change="search"
    />
    <a-divider style="margin: 12px 0 12px 0;"></a-divider>
    <!-- 数据列表 -->
    <issue-table
      :data="data"
      :loading="loading"
      :total="total"
      :page="page"
      :page-size.sync="limit"
      col-update-url="/sys/customlist?listCode=issue-advance-column"
      @change="handleTableChange"
    >
      <span
        slot="action"
        slot-scope="record"
      >
        <a
          v-permission="'issue:record:detail'"
          href="javascript:;"
          @click="goToDetail(record)"
        >
          <!-- 详情链接 -->
          {{ $t('issue_action.detail') }}
        </a>
      </span>
    </issue-table>
  </div>
</template>

<script>
import issueTableMix from '~~/issue-table.js';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

export default {
  name: 'IssueList',
  mixins: [issueTableMix, moduleDynamicCache('question')],
};
</script>
<style lang="less" scoped>
  .container {
    margin: 16px auto;
    padding: 4px 16px 0;
    background-color: #FFFFFF;
    border-radius: 4px;
    border-radius: 4px;
  }
</style>
