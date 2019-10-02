<template>
  <div class="container shadown-block-normal">
    <a-tabs
      :default-active-key="defaultActiveKey"
      :animated="false"
      @change="changeTab"
    >
      <a-tab-pane
        v-permission="'issue:list:todo'"
        key="1"
      >
        <template slot="tab">
          <!-- 待办事项 1 = todo -->
          {{ $t('issue_status.todo') }}
          <a-badge
            show-zero
            :count="dotoTableConfig.total"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
          />
        </template>
        <issue-todo-table
          v-if="defaultActiveKey === '1'"
          col-update-url="/sys/customlist?listCode=issue-todo-columns"
          v-bind.sync="dotoTableConfig"
        ></issue-todo-table>
      </a-tab-pane>
      <a-tab-pane
        v-permission="'issue:list:draft'"
        key="0"
      >
        <span slot="tab">
          <!-- 待发事项（草稿）0 = draft -->
          {{ $t('issue_status.draft') }}
          <a-badge
            show-zero
            :count="draftTableConfig.total"
            :number-style="{
              backgroundColor: 'rgba(0,0,0,0.09)',
              color: 'rgba(0,0,0,0.85)',
            }"
          />
        </span>
        <issue-draft-table
          v-if="defaultActiveKey === '0'"
          col-update-url="/sys/customlist?listCode=issue-draft-columns"
          v-bind.sync="draftTableConfig"
        ></issue-draft-table>
      </a-tab-pane>
      <a-tab-pane
        v-permission="'issue:list:done'"
        key="2"
      >
        <span slot="tab">
          <!-- 已办事项（完成）2 - done -->
          {{ $t('issue_status.done') }}
        </span>
        <issue-done-table
          v-if="defaultActiveKey === '2'"
          col-update-url="/sys/customlist?listCode=issue-done-columns"
        ></issue-done-table>
      </a-tab-pane>
      <a-tab-pane
        v-permission="'issue:list:published'"
        key="3"
      >
        <span slot="tab">
          <!-- 已发事项（待审批）3 = published -->
          {{ $t('issue_status.published') }}
        </span>
        <issue-published-table
          v-if="defaultActiveKey === '3'"
          col-update-url="/sys/customlist?listCode=issue-published-columns"
        ></issue-published-table>
      </a-tab-pane>
      <template
        slot="renderTabBar"
        slot-scope="props, DefaultTabBar"
      >
        <component
          :is="DefaultTabBar"
          {...props}
        />
      </template>
      <template #tabBarExtraContent>
        <a-button
          v-permission="'issue:list:todo:search'"
          v-if="showSearch"
          icon="search"
          type="primary"
          :ghost="true"
          @click="() => dotoTableConfig.showForm = !dotoTableConfig.showForm"
        >
          <!-- 搜索按钮 -->
          {{ $t('search.search_button') }}
        </a-button>
        <a-button
          v-permission="'issue:list:todo:create'"
          icon="plus-circle"
          type="primary"
          @click="createQuestion"
        >
          <!-- 创建问题按钮 -->
          {{ $t('issue_action.create') }}
        </a-button>
      </template>
    </a-tabs>
  </div>
</template>

<script>
import issueTab from '~~/issue-tab.js';
export default {
  name: 'QuestionList',
  mixins: [issueTab]
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
