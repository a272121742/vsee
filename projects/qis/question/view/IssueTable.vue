<template>
  <div>
    <a-table
      row-key="id"
      :data-source="data"
      :pagination="{total: total, current: page}"
      v-on="$listeners"
    >
      <template v-for="col in columns">
        <a-table-column
          v-if="!col.invisible"
          :key="col.title"
          v-bind="filterTitle(col)"
        >
          <span slot="title">{{ $t(`issue.${col.dataIndex}`) }}</span>
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
  </div>
  
</template>

<script>
import {clone} from 'ramda';
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
  title: 'grade',
  dataIndex: 'grade',
  width: 100,
  scopedSlots: { customRender: 'grade' },
  sorter: true
}, {
  // 问题分类
  title: 'source',
  dataIndex: 'source',
  width: 120,
  scopedSlots: { customRender: 'source' }
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
  width: 64,
  scopedSlots: { customRender: 'status' }
}, {
  // 立项时间
  title: 'projectDate',
  dataIndex: 'projectDate',
  width: 120,
  scopedSlots: { customRender: 'projectDate' }
}, {
  // 接受日期
  title: 'receiveDate',
  dataIndex: 'receiveDate',
  width: 120,
  scopedSlots: { customRender: 'receiveDate' }
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
  methods: {
    // handleTableChange ({current = 1, pageSize = 10}, filters, {order = '', field = ''}) {
    //   this.$emit('change', {page: current, limit: pageSize, order, orderField: field});
    // },
    mapping (cols) {
      this.columns = cols;
    },
    filterTitle (col) {
      const newCol = clone(col);
      delete newCol.title;
      return newCol;
    }
  }
}
</script>

<style lang="less" scoped>

</style>