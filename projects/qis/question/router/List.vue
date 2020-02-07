<template>
  <div class="container shadown-block-normal">
    <a-tabs
      :animated="false"
      :active-key="defaultActiveKey"
      @change="changeTab"
    >
      <a-tab-pane
        v-if="$store.getters.hasPermission('issue:list:todo')"
        key="1"
      >
        <template #tab>
          <!-- 待办事项 1 = todo -->
          {{ $t('issue_status.todo') }}
          <a-badge
            :count="dotoTableConfig.total"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
            show-zero
          />
        </template>
        <issue-todo-table
          v-if="defaultActiveKey === '1'"
          v-bind.sync="dotoTableConfig"
          col-update-url="/sys/customlist?listCode=issue-todo-columns"
        ></issue-todo-table>
      </a-tab-pane>
      <a-tab-pane
        v-if="$store.getters.hasPermission('issue:list:draft')"
        key="0"
      >
        <template #tab>
          <!-- 待发事项（草稿）0 = draft -->
          {{ $t('issue_status.draft') }}
          <a-badge
            :count="draftTableConfig.total"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
            show-zero
          />
        </template>
        <issue-draft-table
          v-if="defaultActiveKey === '0'"
          v-bind.sync="draftTableConfig"
          col-update-url="/sys/customlist?listCode=issue-draft-columns"
        ></issue-draft-table>
      </a-tab-pane>
      <a-tab-pane
        v-if="$store.getters.hasPermission('issue:list:done')"
        key="2"
      >
        <template #tab>
          <!-- 已办事项（完成）2 - done -->
          {{ $t('issue_status.done') }}
        </template>
        <issue-done-table
          v-if="defaultActiveKey === '2'"
          col-update-url="/sys/customlist?listCode=issue-done-columns"
        ></issue-done-table>
      </a-tab-pane>
      <a-tab-pane
        v-if="$store.getters.hasPermission('issue:list:published')"
        key="3"
      >
        <template #tab>
          <!-- 已发事项（待审批）3 = published -->
          {{ $t('issue_status.published') }}
        </template>
        <issue-published-table
          v-if="defaultActiveKey === '3'"
          col-update-url="/sys/customlist?listCode=issue-published-columns"
        ></issue-published-table>
      </a-tab-pane>
      <template #tabBarExtraContent>
        <a-button
          v-if="showSearch"
          v-permission="'issue:list:todo:search'"
          :ghost="true"
          type="primary"
          @click="changeFormShown"
        >
          <!-- 搜索按钮 -->
          {{ $t('search.search_button') }}
        </a-button>
        <a-button
          v-permission="'issue:list:todo:create'"
          type="primary"
          @click="createQuestion"
        >
          <!-- 创建问题按钮 -->
          {{ $t('issue_action.create') }}
        </a-button>
        <a-button
          v-permission="'issue:list:batch_import'"
          @click="() => showBatchImportModal=true"
        >
          <!-- 批量导入按钮，引导打开弹窗进行模版下载和导入 -->
          {{ $t('issue_action.batch_import') }}
          <issue-batch-import :visible.sync="showBatchImportModal"></issue-batch-import>
        </a-button>
      </template>
      <!-- 暂存事项 -->
      <a-tab-pane
        v-if="$store.getters.hasPermission('issue:list:temporary')"
        key="4"
      >
        <template #tab>
          <!-- 暂存事项-->
          {{ $t('issue_status.temporary') }}
        </template>
        <issue-temporary-table
          v-if="defaultActiveKey === '4'"
          col-update-url="/sys/customlist?listCode=issue-temporary-columns"
        ></issue-temporary-table>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import issueTab from '~~/issue-tab.js';
import attachmentMix from '~~/issue-attachment.js';

export default {
  name: 'QuestionList',
  mixins: [issueTab, attachmentMix],
};

</script>
<style lang="less">
.ant-table-thead > tr > th.ant-table-column-has-actions {
   -webkit-background-clip:none;
   background-clip:padding-box!important;
}
</style>
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
  .ant-btn {
    margin-left: 12px;
  }
</style>
