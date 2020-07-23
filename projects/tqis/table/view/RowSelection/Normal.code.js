export default `
<template>
  <div>
    <a-page-header
      title="即时缓存"
      sub-title="用于记录当前页已选项，默认配置或配置\`memory: false\`即可"
    >
      <template slot="extra">
        <a-modal
          v-model="showSource"
          centered
          width="80%"
        >
          <SourceCodeView :code="code"></SourceCodeView>
        </a-modal>
        <a-button-group>
          <a-button @click="() => showSource = !showSource">
            源码
          </a-button>
          <a-button
            :disabled="action"
            @click="set"
          >
            加载
          </a-button>
          <a-button
            :disabled="action"
            @click="removeSelected()"
          >
            清空
          </a-button>
        </a-button-group>
      </template>
    </a-page-header>
    <a-alert
      type="info"
      show-icon
    >
      <template #message>
        已经选择 {{ rowSelection.selectedRowKeys.length }} 条数据
      </template>
      <template #description>
        <a-tag
          v-for="selected in selectedRows"
          :key="selected.id"
          closable
          @close="removeSelected(selected)"
        >
          {{ selected.dealerCode }}
        </a-tag>
        <a-tag
          v-if="rowSelection.selectedRowKeys.length"
          style="background: #fff; borderStyle: dashed;"
          @click="removeSelected()"
        >
          <a-icon type="delete" />
        </a-tag>
      </template>
    </a-alert>
    <a-table
      :class="{ 'table-cell-ellipsis': true, 'table-cintainer-fixed-demo': true}"
      row-key="id"
      :data-source="list"
      :pagination="pagination"
      :row-selection="rowSelection"
      :loading="loading"
      :scroll="{ x: 'max-content' }"
      @change="handleTableChange"
    >
      <template v-for="(col, index) in columns">
        <a-table-column
          :key="index"
          v-bind="col"
        >
          <span slot="title">
            {{ col.dataIndex }}
          </span>
          <template slot-scope="text">
            <a-tooltip placement="topLeft">
              <template #title>
                {{ text }}
              </template>
              {{ text }}
            </a-tooltip>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<script>
import rowSelectionMix from '@mix/row-selection.js';
import paginationMix from '@mix/pagination.js';
import $ from '@http';
import { vehicleListColumns } from '~~/model/vehicle.js';
import code from './Normal.code.js';


export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    rowSelectionMix(),
    paginationMix(),
  ],
  data () {
    return {
      columns: vehicleListColumns,
      list: [],
      loading: false,
      showSource: false,
      code,
      action: false,
    };
  },
  watch: {
    loading (value) {
      this.pagination.disabled = value;
    },
  },
  created () {
    this.fetch();
  },
  methods: {
    fetch (config = {}) {
      this.list = [];
      this.loading = true;
      $.get('/masterdata/v1/vehicle/page', { ...config, ...this.serverPagination }).then(this.load).finally(this.reset);
    },
    load (res) {
      this.list = this.empty ? [] : res.list;
      this.pagination.total = res.total;
    },
    set () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const data = [this.list[0], this.list[3]];
        const id = setTimeout(() => {
          this.rowSelection.load(data);
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    reset () {
      this.loading = false;
    },
    handleTableChange () {
      this.fetch();
    },
    removeSelected (selected) {
      if (selected) {
        this.rowSelection.shift(selected);
      } else {
        this.rowSelection.clear();
      }
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-table-wrapper {
    padding-top: 0!important;
    &.table-cintainer-fixed-demo {
      .table-container-fixed-defined(67px; 46px);
    }
    padding-top: 16px;
    /deep/ .ant-table-pagination.ant-pagination {
      margin-top: 8px;
      margin-bottom: 4px;
    }
  }
</style>

`;
