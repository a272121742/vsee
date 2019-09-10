<template>
  <div>
    <a-table
      row-key="id"
      :data-source="data"
      :pagination="{total: total, current: page}"
      v-on="$listeners"
    >
      <a-table-column
        key="serial"
      >
        <span slot="title">{{ $t('serial') }}</span>
        <template slot-scope="text, record, index">
          <span>
            {{ index + 1 }}
          </span>
        </template>
      </a-table-column>

      <template v-for="col in columns">
        <a-table-column
          v-if="!col.invisible"
          :key="col.title"
          :data-index="col.dataIndex"
          :sorter="col.sorter"
          :scoped-slots="col.scopedSlots"
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
const columns = [{
  // 问题编号
  title: 'code',
  dataIndex: 'code',
  scopedSlots: { customRender: 'code' }
}, {
  // 标题
  title: 'title',
  dataIndex: 'title',
  scopedSlots: { customRender: 'title' }
}, {
  // 所属系统
  title: 'faultTreeIds1',
  dataIndex: 'faultTreeIds1',
  scopedSlots: { customRender: 'faultTreeIds1' }
}, {
  // 问题等级
  title: 'grade',
  dataIndex: 'grade',
  scopedSlots: { customRender: 'grade' },
  sorter: true
}, {
  // 问题分类
  title: 'source',
  dataIndex: 'source',
  scopedSlots: { customRender: 'source' }
}, {
  // 问题阶段
  title: 'projectPhase',
  dataIndex: 'projectPhase',
  scopedSlots: { customRender: 'projectPhase' }
}, {
  // TODO: 目前取出来是草稿，后台修改后变为：D0、D1、D2....
  title: 'status',
  dataIndex: 'status',
  scopedSlots: { customRender: 'status' }
}, {
  // TODO: 暂时没有这个字段，使用生产日期代替显示
  title: 'productDate',
  dataIndex: 'productDate',
  scopedSlots: { customRender: 'productDate' }
}, {
  // 接受日期
  title: 'receiveDate',
  dataIndex: 'receiveDate',
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
  }
}
</script>

<style lang="less" scoped>

</style>