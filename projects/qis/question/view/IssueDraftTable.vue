<template>
  <!-- 表格 -->
  <a-table
    :loading="loading"
    :data-source="data"
    :scroll="{ x: 1250 }"
    :pagination="{ total, current: page, limit, showTotal, showQuickJumper: true }"
    @change="handleTableChange"
    row-key="id"
  >
    <template v-for="col in columns">
      <a-table-column
        v-if="!col.invisible"
        :key="col.title"
        v-bind="filterTitle(col)"
      >
        <span slot="title">{{ $t(`issue.${col.dataIndex}`) }}</span>
        <template slot-scope="text">
          <a-tooltip>
            <template #title>
              {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text }}
            </template>
            {{ col.dataIndex === 'status' ? ((text === 'D' ? '' : `${text}-`) + $t(`issue_workflow.${text}.processName`)) : text }}
          </a-tooltip>
        </template>
      </a-table-column>
    </template>
    <a-table-column
      key="action"
      fixed="right"
    >
      <template #title>
        <!-- <col-provider
          v-if="url && id"
          :id="id"
          :url="url"
          :columns="columns"
          :transform="$t.bind(_self)"
          :mapping="mapping"
          locale-path="issue"
        ></col-provider> -->
      </template>
      <template slot-scope="text, record">
        <a
          v-permission="'issue:record:detail'"
          @click="goToEdit(record.id)"
          href="javascript:;"
        >
          <!-- 详情链接 -->
          {{ $t('issue_action.detail') }}
        </a>
      </template>
    </a-table-column>
  </a-table>
</template>

<script>
import { defaultTo } from 'ramda';
import { clearObserver } from '@util/datahelper.js';
import { issueDraftColumns } from '~~/model.js';
import { createNamespacedHelpers } from 'vuex';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

const { mapActions } = createNamespacedHelpers('question');

export default {
  name: 'IssueDraftTable',
  components: {
    // ColProvider: () => import('@comp/table/ColProvider.vue')
  },
  mixins: [moduleDynamicCache('question')],
  props: {
    /**
     * 列更新地址
     */
    colUpdateUrl: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      total: 0,
      data: [],
      loading: false
    };
  },

  computed: {
    order () {
      return defaultTo('', this.advancePageConfig.draftOrderData.order).slice(0, -3);
    },
    orderField () {
      return this.advancePageConfig.draftOrderData.field;
    },
    page () {
      return this.advancePageConfig.draftPageData.current;
    },
    limit () {
      return this.advancePageConfig.draftPageData.pageSize;
    },
    columns () {
      const orderData = this.advancePageConfig.draftOrderData;
      return issueDraftColumns.map(col => {
        const newCol = clearObserver(col);
        if (newCol.dataIndex === orderData.field) {
          newCol.sortOrder = orderData.order;
        } else {
          newCol.sortOrder = void 0;
        }
        return newCol;
      });
    }
    // // 计算「更新列配置」的api
    // url () {
    //   return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[0];
    // },
    // // 计算「更新列配置」传过来的id值
    // id () {
    //   return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[1];
    // }
  },
  created () {
    this.request({}, true);
  },
  methods: {
    ...mapActions({
      // 分页查询待发列表
      getData: 'getIssueDraftPage'
    }),
    /**
     * 当列配置更新时，重新映射
     */
    mapping (cols) {
      this.columns = cols;
    },
    /**
     * 过滤掉标题
     */
    filterTitle (col) {
      const newCol = clearObserver(col);
      delete newCol.title;
      return newCol;
    },
    /**
     * 显示总数(分页组件使用)
     */
    showTotal (total) {
      if (this.data.length) {
        const totalText = this.$t('pagination.total');
        const pageCount = Math.ceil(total / this.limit);
        const pageText = this.$t('pagination.page');
        return [totalText, pageCount, pageText].join(' ');
      }
      return '';
    },
    /**
     * 请求数据
     */
    request (config, init = false) {
      if (!this.loading) {
        this.loading = true;
        const {
          page, limit, order, orderField
        } = this;
        this.getData({
          page, limit, order, orderField, ...config
        }).then(res => {
          this.$set(this, 'data', res.list);
          this.total = res.total;
          init && this.$emit('update:total', res.total);
          this.$nextTick(() => {
            this.loading = false;
          });
        });
      }
    },
    /**
     * 表格分页、筛选、排序切换时
     */
    handleTableChange ({ current = 1, pageSize = 10 }, filters, { order = '', field = '' }) {
      // 缓存数据到store
      this.changeAdvancePageConfig({ draftOrderData: { order, field } });
      this.changeAdvancePageConfig({ draftPageData: { current, pageSize } });
      this.request();
    },
    // /**
    //  * 搜索（根据表单传过来的条件）
    //  */
    // search (filters) {
    //   this.page = 1;
    //   this.request(filters);
    // },
    // 查看详情（TODO:待发事项待详情作成编辑功能，显示不变）
    goToEdit (record) {
      this.$router.push({
        name: 'QuestionCreate',
        params: {
          name: 'edit',
          id: record
        },
        query: {
          form: this.$route.path
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
  /deep/ .ant-table{
    // 设置表格内容不换行
    table {
      // width: 100%; /*必须设置，否则还是会拉长单元格*/
      table-layout: fixed;/*只有定义表格的算法为fixed,th才有效果*/
      word-wrap:break-all;
    }
    th > div, td {
      overflow:hidden;/*超出长度的文字隐藏*/
      text-overflow:ellipsis;/*文字隐藏以后添加省略号*/
      white-space:nowrap;/*强制不换行*/
      word-break:keep-all;/*文字不换行*/
    }
    // 设置单元格内填充
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 16px;
    }
    // 矫正排序按钮的位置
    .ant-table-column-sorter {
      right: 16px!important;
      margin-top: -10px!important;
    }
  }
  /deep/ .ant-pagination {
    display: inline-flex;
    li.ant-pagination-item,
    li.ant-pagination-prev,
    li.ant-pagination-next,
    li.ant-pagination-jump-prev,
    li.ant-pagination-jump-next {
      order: 1;
    }
    li.ant-pagination-total-text {
      order: 2;
      margin: 1px -6px 0 12px;
    }
    li.ant-pagination-options {
      order: 3;
    }
  }
</style>
