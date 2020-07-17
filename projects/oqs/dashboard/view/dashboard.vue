<template>
  <a-table
    class="board-view"
    :row-class-name="() => 'board-view-row'"
    :data-source="dataSource"
    :pagination="false"
    :scroll="{x: true}"
    :loading="loading"
    bordered
    row-key="id"
  >
    <a-table-column
      key="left"
      data-index="row"
      fixed="left"
      align="center"
      :width="130"
    />

    <!-- 遍历Header信息 -->
    <a-table-column-group
      v-for="(metas, level1) in metaHeader"
      :key="level1"
      class="board-view-header"
    >
      <span
        slot="title"
        class="board-view-header-level1"
      >{{ level1.split(',')[0] }}</span>
      <!-- 遍历Meta信息 -->
      <a-table-column
        v-for="(meta, index) in metas"
        :key="meta"
        :title="meta"
        :data-index="meta"
        :min-width="96"
        :class="{ 'board-view-data': true, 'board-view-data-level-first': !index }"
      >
        <template slot-scope="text, record,">
          <div
            :class="{'board-cell-container': true, 'board-cell-container-up' : record[`${meta}_STANDARD`] === true, 'board-cell-container-down': record[`${meta}_STANDARD`] === false}"
            @click.prevent.stop="(e)=>$emit('cell-click', e, text, record,meta,level1)"
          >
            <div class="board-cell-layer-bottom"></div>
            <a-tooltip overlay-class-name="tlp">
              <template #title>
                <div>
                  <span><div class="circle"></div>{{ `工厂:${level1.split(',')[0]}` }}</span>
                </div>
                <div>{{ `车型:${meta}` }}</div>
                <div>{{ `实际值:${ text===undefined?'':text.split(',')[0] }` }}</div>
                <div>{{ `目标值:${ text === undefined?'':text.split(',')[1] }` }}</div>
                <div>{{ `指标名称:${record.row}` }}</div>
              </template>
              <div class="board-cell-layer-top">
                <div class="board-cell-warpper">
                  {{ text===undefined?'':text.split(',')[0] }}
                </div>
              </div>
            </a-tooltip>
          </div>
        </template>
      </a-table-column>
    </a-table-column-group>
  </a-table>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    dataSource: {
      type: Array,
      default: () => [],
    },
    metaHeader: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style lang="less" scoped>
// 背景底色
@bg-color: white;
// 常规色
@color-normal: @disabled-color;
// 背景常规色
@bg-color-normal: #FAFAFA;
// 边框阴影
@box-shadow-normal: 0 1px 4px 0 rgba(0, 0, 0, .1);
// 边框色
// 边框
@border-normal: 1px solid fade(@border-color-base,20);
// 通行色
@color-up: @success-color;
// 未达色
@color-down: @error-color;
// 通行背景色
@bg-color-up: fade(@color-up, 4);
// 未达背景色
@bg-color-down: fade(@color-down, 4);
// 表格头部信息颜色
@font-color-head: @heading-color;
// 表格左边固定列颜色
@font-color-fixed: #738695;

// 看板视图
.board-view {
  // 看板容器，分为上下两层
  .board-cell-container {

    & {
      // 看板容器样式
      display: flex;
      align-items: center;
      height: calc((100vh - 64px - 48px - 0px - 0px - 2*16px - 110px - 2*16px - 24px - 260px)/6);
      min-height: 50px;
      min-width: 100px;
      cursor: pointer;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      // 底层样式
      .board-cell-layer-bottom {
        // position: absolute;
        // left: -4px;
        width: 4px;
        height: calc((100vh - 64px - 48px - 0px - 0px - 2*16px - 110px - 2*16px - 24px - 450px)/6);
        min-height: 24px;
        background-color: @color-normal;
        border-radius: 8px 0px 0px 8px;
      }
      // 顶层样式
      .board-cell-layer-top {
        letter-spacing: 0;
        // position: absolute;
        width: 100%;
        height: 100%;
        border: @border-normal;
        box-shadow: @box-shadow-normal;
        background-color: @bg-color;
        font-size: 24px;
        border-radius: 4px;

        .board-cell-warpper {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 100%;
          height: 100%;
          background-color: @bg-color-normal;
          color: @color-normal;
        }
      }
    }
    &.board-cell-container-up {
      .board-cell-layer-bottom {
        background-color: @color-up;
      }
      .board-cell-layer-top .board-cell-warpper {
        background-color: @bg-color-up;
        color: @color-up;
      }
    }
    &.board-cell-container-down {
      .board-cell-layer-bottom {
        background-color:@color-down;
      }
      .board-cell-layer-top .board-cell-warpper {
        background-color: @bg-color-down;
        color: @color-down;
      }
    }
  }
  /deep/ .ant-table {
    .ant-table-fixed-left {
      .ant-table-fixed {
        border: 1px solid transparent;
        border-right: none;
      }
      tr.ant-table-row td {
        // 左边标题
        font-size: 14px;
        color: @font-color-fixed;
        padding: 10px 16px;
        height: calc((100vh - 64px - 48px - 0px - 0px - 2*16px - 110px - 2*16px - 32px - 70px)/6);
      }
    }
    .ant-table-content {
      thead.ant-table-thead tr th {
        background-color: unset;
        font-size: 14px;
        color: @font-color-head;
        text-align: center;
        padding: 4px;
        .board-view-header-level1 {
          font-size: 18px;
        }
      }
      tbody.ant-table-tbody tr td {
        &.board-view-data {
          border-right: 1px solid transparent;
          border-bottom: 1px solid transparent;
          padding: 10px 20px;
          height: calc((100vh - 64px - 48px - 0px - 0px - 2*16px - 110px - 2*16px - 32px - 70px)/6);
        }
      }
      .ant-table-fixed-columns-in-body div:first-child {
        width: 93px;
      }
    }
  }
}

</style>
