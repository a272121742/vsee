<template>
  <div class="root">
    <!-- 筛选表单 -->
    <div>
      <issue-search-form></issue-search-form>
    </div>
    <!-- 操作按钮 -->
    <div class="operate-buttons">
      <!-- 单车报告 -->
      <router-link
        :to="{
          path:'/issue/definition-list/create-single',
          query:{asqIssueRptType: '1',isHandmade: '1',}}"
      >
        <a-button
          type="primary"
        >
          <a-icon type="icondccj_outlined1"></a-icon>
          {{ $t('action.single_report') }}
        </a-button>
      </router-link>
      <!-- 批量报告 -->
      <router-link
        :to="{
          path:'/issue/definition-list/create-batch',
          query:{asqIssueRptType: '2',isHandmade: '1',}
        }"
      >
        <a-button
          type="primary"
          :style="{ marginLeft: '8px' }"
        >
          <a-icon type="iconplcj_outlined1"></a-icon>
          {{ $t('action.batch_report') }}
        </a-button>
      </router-link>
    </div>
    <!-- 表格 -->
    <div>
      <a-table
        class="ellipsis-table"
        :data-source="list"
        row-key="id"
        :pagination="pagination"
        :scroll="{x: 1800}"
        :loading="loading"
        @change="tableChangeHandle"
      >
        <template v-for="(col,index) in columns">
          <a-table-column
            :key="index"
            v-bind="col"
          >
            <span slot="title">
              {{ $t(`issue.${col.dataIndex}`) }}
            </span>
            <template slot-scope="text, row">
              <!-- 操作列 -->
              <template v-if="col.dataIndex === 'operate'">
                <template
                  v-if="[null,''].includes(row.issueStatus)"
                >
                  <router-link
                    :to="{ path: `/issue/definition-list/update/${row.id}` }"
                  >
                    {{ $t('action.edit') }}
                  </router-link>
                  <a-divider
                    type="vertical"
                  />
                  <a-popconfirm
                    :title="$t('feedback.sure2Delete')"
                    @confirm="() => deleteReport(row.id)"
                  >
                    <a href="javascript:;">
                      {{ $t('action.delete') }}
                    </a>
                  </a-popconfirm>
                </template>
              </template>
              <a-tooltip
                v-else-if="!['asqIssueRptCode', 'issueCode'].includes(col.dataIndex)"
                placement="topLeft"
              >
                <template #title>
                  {{ text }}
                </template>
                {{ text }}
              </a-tooltip>
              <a-tooltip v-else-if="['asqIssueRptCode'].includes(col.dataIndex)">
                <template #title>
                  {{ text }}
                </template>
                <span>
                  <router-link
                    :to="{
                      path: `/issue/definition-list/report/${row.id}?asqIssueRptType=${row.asqIssueRptType}`
                    }"
                  >
                    {{ row[col.dataIndex] }}
                  </router-link>
                </span>
              </a-tooltip>
              <a-tooltip v-else-if="['issueCode'].includes(col.dataIndex)&& row.issueStatus==='问题创建'">
                <template #title>
                  {{ text }}
                </template>
                <a
                  :href="`/qis/question/question-create/edit/${row.issueId}`"
                  target="_blank"
                >
                  {{ row[col.dataIndex] }}
                </a>
              </a-tooltip>
              <a-tooltip
                v-else
                placement="topLeft"
              >
                <template #title>
                  {{ text }}
                </template>
                <a
                  :href="`/qis/question/question-detail-new/${row.issueId}`"
                  target="_blank"
                >
                  {{ row[col.dataIndex] }}
                </a>
              </a-tooltip>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { omit } from 'ramda';
import storeModuleMix from '@mix/store-module.js';
import tableRowSelectionMix from '@mix/table-row-selection.js';
import paginationMix from '@mix/pagination.js';
import { issueListColumns } from '~~/model/issue.js';

const omitSearchFields = omit(['createDate']);

export default {
  components: {
    'issue-search-form': () => import('../view/issue-search-form.vue'),
  },
  mixins: [
    tableRowSelectionMix(),
    paginationMix(),
    storeModuleMix({
      name: 'issue',
      action: ['getProblemReport', 'deleteProblemReport'],
    }),
  ],
  data () {
    return {
      columns: issueListColumns,
      list: [],
      total: 0,
      loading: false,
      pagination: {
        pageSizeOptions: ['10', '20', '50', '100'],
      },
      isHandmade: '',
      asqIssueRptType: '',
    };
  },
  computed: {},
  watch: {
    '$store.state.issue.issueSearchData': function (value) {
      this.pagination.current = 1;
      this.fetch(omitSearchFields(value));
    },
  },
  created () {
    this.fetch();
  },
  methods: {
    fetch (config = {}) {
      this.loading = true;
      this.getProblemReport({ ...config, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = res.list;
      this.pagination.total = res.total;
    },
    reset () {
      this.loading = false;
    },
    tableChangeHandle () {
      this.fetch(this.$store.state.issue.issueSearchData);
    },

    // 点击删除按钮
    deleteReport (id) {
      this.deleteProblemReport({ ids: id }).then(() => {
        const list = [...this.list];
        this.list = list.filter((item) => item.id !== id);
        this.fetch();
      });
    },
  },
};
</script>

<style lang="less" scoped>
@table-height:609px;
@table-head-height:54px;
  .root {
    .underline {
      text-decoration: underline;
    }
    .ant-table-wrapper {
        padding-top: 16px;
        /deep/ .ant-spin-nested-loading {
          height: @table-height;
        }
        /deep/ .ant-table-placeholder {
          height: calc(@table-height - @table-head-height);
          .ant-empty-normal {
            margin-top: calc(@table-height / 2 - @table-head-height);
          }
        }
    }
    .operate-buttons {
      margin-top: 8px;
    }
  }
</style>
