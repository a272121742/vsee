<template>
  <a-tabs
    :animated="false"
    :active-key="defaultActiveKey"
    @change="changeTab"
  >
    <a-tab-pane
      v-if="$store.getters.hasPermission('issue:home:todo')"
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
      ></issue-todo-table>
    </a-tab-pane>
    <a-tab-pane
      v-if="$store.getters.hasPermission('issue:home:draft')"
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
    <template #tabBarExtraContent>
      <a-button
        v-if="showSearch"
        v-permission="'issue:home:todo:search'"
        :ghost="true"
        type="primary"
        @click="changeFormShown"
      >
        <!-- 搜索按钮 -->
        {{ $t('search.search_button') }}
      </a-button>
      
      <a-button
        v-if="showTemplateDownload"
        v-permission="'issue:home:draft:temp_download'"
        type="primary"
        ghost
        @click="templateDownload"
      >
        <!-- 模版下载按钮 -->
        {{ $t('issue_action.template_download') }}
      </a-button>
      <a-upload
        accept=".xlsx"
        :action="$store.getters.getUrl('/issue/v1/issue/import')"
        :headers="headers"
        :show-upload-list="false"
        style="display: inline-block;"
        @change="batchImport"
      >
        <a-button
          v-if="showBatchImport"
          v-permission="'issue:home:draft:batch_import'"
          type="primary"
          ghost
          @click="batchImport"
        >
          <!-- 批量导入按钮 -->
          {{ $t('issue_action.batch_import') }}
        </a-button>
      </a-upload>
      <a-button
        v-permission="'issue:home:todo:create'"
        type="primary"
        @click="createQuestion"
      >
        <!-- 创建问题按钮 -->
        {{ $t('issue_action.create') }}
      </a-button>
    </template>
  </a-tabs>
</template>

<script>
import issueTab from '~~/issue-tab.js';
import attachmentMix from '~~/issue-attachment.js';

export default {
  name: 'HomeBlock',
  mixins: [issueTab, attachmentMix]
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
