<template>
  <div class="container">
    <a-row
      class="row1 shadown-block-normal"
    >
      <a-card class="banner-card">
        <img
          slot="cover"
          src="/static/portal/portal_banner.png"
        >
      </a-card>
    </a-row>
    <a-row
      class="row2 shadown-block-normal"
    >
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
        @change="request"
      />
      <!-- 数据列表 -->
      <issue-table
        col-update-url="/sys/customlist?listCode=issue-columns"
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
    </a-row>
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
    /deep/ .ant-table{
      table {
        // width: 100%; /*必须设置，否则还是会拉长单元格*/
        // table-layout: fixed;/*只有定义表格的算法为fixed,th才有效果*/
        // word-wrap:break-all;
      }
      th > div, td {
        overflow:hidden;/*超出长度的文字隐藏*/
        text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
        white-space:nowrap;/*强制不换行*/
        word-break:keep-all;/*文字不换行*/
      }
    }
  }
  /deep/.ant-table-thead > tr > th, /deep/.ant-table-tbody > tr > td {
      padding: 16px 11px;
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
