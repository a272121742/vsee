<template>
  <a-table
    row-key="id"
    :data-source="[...data, ...fill]"
    :pagination="{total: total, current: page, showSizeChanger: true, pageSizeOptions: ['10', '20', '50'], showTotal}"
    v-on="$listeners"
  >
    <template v-for="col in columns">
      <a-table-column
        v-if="!col.invisible"
        :key="col.title"
        v-bind="filterTitle(col)"
      >
        <span slot="title">{{ $t(`issue.${col.dataIndex}`) }}</span>
        <template slot-scope="text, record">
          {{ text }}
        </template>
      </a-table-column>
    </template>

    <a-table-column
      key="action"
    >
      <template #title>
        <col-provider
          v-if="url && id"
          :url="url"
          :id="id"
          :columns="columns"
          :transform="$t.bind(_self)"
          :mapping="mapping"
          locale-path="issue"
        ></col-provider>
      </template>
      <template slot-scope="text, record, index">
        <slot name="action" v-bind="record"></slot>
      </template>
    </a-table-column>
  </a-table>
  
</template>

<script>
import {clone} from 'ramda';
import moment from 'moment';
const columns = [{
  // 问题编号
  title: 'code',
  dataIndex: 'code',
  width: 136,
  scopedSlots: { customRender: 'code' }
}, {
  // 标题
  title: 'title',
  dataIndex: 'title',
  width: 200,
  scopedSlots: { customRender: 'title' }
}, {
  // 所属系统
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1',
  width: 80,
  scopedSlots: { customRender: 'faultTreeIds1' }
}, {
  // 问题等级
  title: 'gradeName',
  dataIndex: 'gradeName',
  width: 100,
  scopedSlots: { customRender: 'gradeName' },
  sorter: true
}, {
  // 问题分类
  title: 'sourceName',
  dataIndex: 'sourceName',
  width: 120,
  scopedSlots: { customRender: 'sourceName' }
}, {
  // 问题阶段
  title: 'projectPhase',
  dataIndex: 'projectPhase',
  width: 160,
  scopedSlots: { customRender: 'projectPhase' }
}, {
  // TODO: 目前取出来是草稿，后台修改后变为：D0、D1、D2....
  title: 'status',
  dataIndex: 'status',
  width: 100,
  sorter: true,
  scopedSlots: { customRender: 'status' }
}, {
  // 立项时间
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 108,
  scopedSlots: { customRender: 'projectDate' },
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}, {
  // 接受日期
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 108,
  scopedSlots: { customRender: 'receiveDate' },
  customRender (date) {
    return date ? moment(date).format('YYYY-MM-DD') : '';
  }
}];
export default {
  components: {
    ColProvider: () => import('@comp/table/ColProvider.vue')
  },
  props: {
    /**
     * 数据，从上层组件获取，上层组件通过服务端获取
     */
    data: {
      type: Array,
      default: []
    },
    /**
     * 总数，从上层组件获取，上层组件通过服务端获取
     */
    total: {
      type: Number,
      default: 0
    },
    /**
     * 当前页
     */
    page: {
      type: Number,
      default: 1
    },
    /**
     * 列更新地址
     */
    colUpdateUrl: {
      type: String,
      default: ''
    },
  },
  data () {
    return {
      /**
       * 列信息
       */
      columns,
      /**
       * 自填充信息
       */
      fill: [],
    }
  },
  computed: {
    url () {
      return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[0];
    },
    id () {
      return this.colUpdateUrl && this.colUpdateUrl.split(/\?\w+=/)[1];
    }
  },
  // updated () {
  //   const pageSize = this.$refs.table.$children[0].$children[0].$children[1].pageSize;
  //   console.log(this.$refs.table.$children[0].$children[0].$children[1].pageSize);
  //   if (this.data.length < pageSize) {
  //     this.$set(this, 'fill', new Array(pageSize - this.data.length).map(_ => ({id: Date.now()})));
  //   }
  // },
  methods: {
    mapping (cols) {
      this.columns = cols;
    },
    filterTitle (col) {
      const newCol = clone(col);
      delete newCol.title;
      return newCol;
    },
    showTotal (total) {
      if (this.data.length) {
        const totalText = this.$t('pagination.total');
        const pageCount = Math.ceil(total / this.data.length);
        const pageText = this.$t('pagination.page')
        return [totalText, pageCount, pageText].join(' ');
      }
      return '';
    },
  }
}
</script>

<style lang="less" scoped>
  /deep/ .ant-pagination {
    display: inline-flex;
    li.ant-pagination-item,  
    li.ant-pagination-prev, 
    li.ant-pagination-next,
    li.ant-pagination-jump-next {
      order: 1;
    }
    li.ant-pagination-total-text {
      order: 2;
      margin: 0 -6px 0 12px;
    }
    li.ant-pagination-options {
      order: 3;
    }
  }
</style>