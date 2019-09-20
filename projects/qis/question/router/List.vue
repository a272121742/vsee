<template>
  <div class="container shadown-block-normal">
    <a-tabs
      :active-key="activeKey"
      @change="changeTable"
    >
      <a-tab-pane
        key="1"
      >
        <template slot="tab">
          <!-- 待办事项 1 = todo -->
          {{ $t('issue_status.todo') }}
          <a-badge
            show-zero
            :count="total1"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
          />
        </template>
      </a-tab-pane>
      <a-tab-pane
        key="0"
      >
        <span slot="tab">
          <!-- 待发事项（草稿）0 = draft -->
          {{ $t('issue_status.draft') }}
          <a-badge
            show-zero
            :count="total0"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
          />
        </span>
      </a-tab-pane>
      <a-tab-pane
        key="2"
      >
        <span slot="tab">
          <!-- 已办事项（完成）2 - done -->
          {{ $t('issue_status.done') }}
        </span>
      </a-tab-pane>
      <a-tab-pane
        key="3"
      >
        <span slot="tab">
          <!-- 已发事项（待审批）3 = published -->
          {{ $t('issue_status.published') }}
        </span>
      </a-tab-pane>
      <template #tabBarExtraContent>
        <a-button
          v-if="showSearch"
          icon="search"
          type="primary"
          :ghost="true"
          @click="() => hideForm = !hideForm"
        >
          <!-- 搜索按钮 -->
          {{ $t('search.search_button') }}
        </a-button>
        <a-button
          v-permission="'issue:owner:create'"
          icon="plus-circle"
          type="primary"
          @click="createQuestion"
        >
          <!-- 创建问题按钮 -->
          {{ $t('issue_action.create') }}
        </a-button>
      </template>
    </a-tabs>
    <!-- 搜索表单 -->
    <issue-search-form
      :hide="hideForm"
      @hidden="hiddenForm"
      @change="search"
    />
    <!-- 数据列表 -->
    <issue-table
      col-update-url="/sys/customlist?listCode=issue-column"
      :data="data"
      :total="total"
      :page="page"
      :page-size.sync="limit"
      @change="handleTableChange"
    >
      <span
        slot="action"
        slot-scope="record"
      >
        <a
          href="javascript:;"
          @click="goToDetail(record.id)"
        >
          <!-- 详情链接 -->
          {{ $t('issue_action.detail') }}
        </a>
      </span>
    </issue-table>
  </div>
</template>

<script>
import { issueTableMix } from '@@cmd/issue-table.js';

export default {
  name: 'QuestionList',
  mixins: [issueTableMix]
}

</script>
<style lang="less" scoped>
  .container {
    margin: 16px auto;
    padding: 4px 16px 0;
    background-color: #FFFFFF;
    border-radius: 4px;
    border-radius: 4px;
  }
 /deep/ .ant-form-item {
    display: flex;
  }
  /deep/ .ant-form-item-label {
    flex: .5;
  }
  /deep/ .ant-form-item-control-wrapper {
    flex: 1;
  }
</style>
