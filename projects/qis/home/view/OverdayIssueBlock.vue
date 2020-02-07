<template>
  <a-card
    :bordered="false"
  >
    <template #title>
      {{ $t('overday_title') }}
    </template>
    <a-table
      :data-source="list"
      row-key="id"
      :pagination="false"
      :bordered="false"
      :scroll="{y: 128}"
      :loading="loading"
      style="height: 176px; margin-top: 7px;"
    >
      <template v-for="(col, index) in columns">
        <a-table-column
          :key="index"
          v-bind="filterTitle(col)"
        >
          <span slot="title">
            {{ $t(`issue.${col.dataIndex}`) }}
          </span>
          <template slot-scope="text">
            <a-tooltip>
              <template #title>
                {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text || '—' }}
              </template>
              {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text || '—' }}
            </a-tooltip>
          </template>
        </a-table-column>
      </template>
      <a-table-column :width="40">
        <template slot-scope="text, record">
          <a
            v-permission="'issue:record:detail'"
            href="javascript:;"
            @click="goToDetail(record)"
          >
            <!-- 详情链接 -->
            {{ $t('issue_action.detail') }}
          </a>
        </template>
      </a-table-column>
    </a-table>
  </a-card>
</template>
<i18n>
{
  "en": {
    "overday_title": "Overs"
  },
  "zh": {
    "overday_title": "超期"
  }
}
</i18n>

<script>
import { createNamespacedHelpers } from 'vuex';
import { clone } from 'ramda';
import { overdayColumns } from '~~/model.js';

const { mapActions } = createNamespacedHelpers('home');

// 超期问题快
export default {
  data () {
    return {
      list: [],
      columns: overdayColumns,
      total: 0,
      loading: false,
    };
  },
  created () {
    this.init();
  },
  methods: {
    ...mapActions(['getIssueOverDaysList']),
    init () {
      this.fetch();
    },
    fetch () {
      this.loading = true;
      const user = this.$store.getters.getUser();
      this.getIssueOverDaysList({
        userId: user.id, page: 1, limit: 100, order: 'desc', orderField: 'overDays',
      }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = res.list;
      this.total = res.total;
    },
    reset () {
      this.loading = false;
    },
    /**
     * 过滤掉标题
     */
    filterTitle (col) {
      const newCol = clone(col);
      delete newCol.title;
      return newCol;
    },
    // 查看详情
    goToDetail (record) {
      if (record.procDefKey === 'IRS1') {
        this.$router.push({
          name: 'QuestionDetail',
          params: {
            id: record.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      } else if (record.procDefKey === 'IRS2') {
        this.$router.push({
          name: 'QuestionDetailNew',
          params: {
            id: record.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      } else if (record.procDefKey === 'IRS3') {
        this.$router.push({
          name: 'SubQuestionDetailNew',
          params: {
            id: record.id,
          },
          query: {
            form: this.$route.path,
          },
        });
      }
      this.$store.dispatch('refresh');
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-card {
    /deep/ .ant-card-head {
      min-height: unset;
      border-bottom: unset;
      .ant-card-head-title {
        line-height: 1;
        padding-bottom: 0;
      }
    }
    /deep/ .ant-card-body {
      padding: 0 12px 12px;
      height: 188px;
      .ant-empty-normal {
        margin: 16px 0;
      }
      // 设置表格内容不换行
      table {
        width: 100%; /*必须设置，否则还是会拉长单元格*/
        table-layout: fixed;/*只有定义表格的算法为fixed,th才有效果*/
        word-wrap:break-all;
      }
      th > div, td {
        overflow:hidden;/*超出长度的文字隐藏*/
        text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
        white-space:nowrap;/*强制不换行*/
        word-break:keep-all;/*文字不换行*/
      }
      .ant-table-thead > tr > th{
        padding: 12px;
      }
      .ant-table-tbody > tr > td {
        padding: 6px;
      }
    }
  }
</style>
