<template>
  <div class="container">
    <a-row
      class="row1 shadown-block-normal"
    >
      <a-card class="banner-card">
        <img
          slot="cover"
          src="/static/question/issue_banner.png"
        >
      </a-card>
    </a-row>
    <a-row
      class="row2 shadown-block-normal"
    >
      <a-tabs
        :animated="false"
        @change="changeTab"
      >
        <a-tab-pane
          key="1"
          v-if="$store.getters.hasPermission('issue:home:todo')"
        >
          <template slot="tab">
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
          key="0"
          v-if="$store.getters.hasPermission('issue:home:draft')"
        >
          <span slot="tab">
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
          </span>
          <issue-draft-table
            v-if="defaultActiveKey === '0'"
            v-bind.sync="draftTableConfig"
            col-update-url="/sys/customlist?listCode=issue-draft-columns"
          ></issue-draft-table>
        </a-tab-pane>
        <!-- <template
          slot="renderTabBar"
          slot-scope="props, DefaultTabBar"
        >
          <component
            :is="DefaultTabBar"
            {...props}
          />
        </template> -->
        <template #tabBarExtraContent>
          <a-button
            v-permission="'issue:home:todo:search'"
            v-if="showSearch"
            :ghost="true"
            @click="() => dotoTableConfig.showForm = !dotoTableConfig.showForm"
            icon="search"
            type="primary"
          >
            <!-- 搜索按钮 -->
            {{ $t('search.search_button') }}
          </a-button>
          <a-button
            v-permission="'issue:home:todo:create'"
            @click="createQuestion"
            icon="plus-circle"
            type="primary"
          >
            <!-- 创建问题按钮 -->
            {{ $t('issue_action.create') }}
          </a-button>
        </template>
      </a-tabs>
    </a-row>
  </div>
</template>

<script>
import issueTab from '~~/issue-tab.js';
export default {
  name: 'Home',
  mixins: [issueTab]
};
</script>

<style lang="less" scoped>
  .container {
    background-color: transparent!important;
    .row1 {
      margin: 16px 0;
      .banner-card {
        border-radius: 4px;
        border-radius: 4px;
        img {
          height: 220px;
          object-fit: cover;
        }
      }
    }
    .row2 {
      margin: 16px 0;
      background-color: #FFFFFF;
      padding: 8px 12px 0 12px;
      border-radius: 4px;
      border-radius: 4px;
    }
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
