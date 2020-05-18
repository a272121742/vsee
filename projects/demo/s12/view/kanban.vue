<template>
  <a-table
    class="board-view"
    :row-class-name="() => 'board-view-row'"
    :data-source="dataSource"
    :pagination="false"
    :scroll="{x: true}"
    bordered
    row-key="id"
  >
    <a-table-column
      key="left"
      data-index="row"
      fixed="left"
      align="center"
      :width="120"
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
      >{{ level1 }}</span>
      <!-- 遍历Meta信息 -->
      <a-table-column
        v-for="(meta, index) in metas"
        :key="meta"
        :title="meta"
        :data-index="meta"
        :width="120"
        :class="{ 'board-view-data': true, 'board-view-data-level-first': !index }"
      >
        <template slot-scope="text, record">
          <div
            :class="{'board-cell-container': true, 'board-cell-container-up' : record[`${meta}_STANDARD`] === true, 'board-cell-container-down': record[`${meta}_STANDARD`] === false}"
            @click.prevent.stop="$emit('cell-click', e, text, record)"
          >
            <div class="board-cell-layer-bottom"></div>
            <div class="board-cell-layer-top">
              <div class="board-cell-warpper">
                {{ record && text ? `${text}%` : null }}
              </div>
            </div>
          </div>
        </template>
      </a-table-column>
    </a-table-column-group>
  </a-table>
</template>

<script>
export default {
  props: {
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
@border-normal: 1px solid @border-color-base;
// 通行色
@color-up: @success-color;
// 未达色
@color-down: @error-color;
// 通行背景色
@bg-color-up: fade(@color-up, .04);
// 未达背景色
@bg-color-down: fade(@color-down, .04);
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
      height: 82px;
      width: 108px;
      position: relative;
      cursor: pointer;
      left: 50%;
      transform: translateX(-50%);
      // 底层样式
      .board-cell-layer-bottom {
        position: absolute;
        left: -4px;
        width: 8px;
        height: 56px;
        background-color: @color-normal;
        border-radius: 8px;
      }
      // 顶层样式
      .board-cell-layer-top {
        letter-spacing: 0;
        position: absolute;
        width: 100%;
        height: 100%;
        border: @border-normal;
        box-shadow: @box-shadow-normal;
        background-color: @bg-color;
        font-size: 30px;
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
    // td {
    //   white-space: nowrap;
    // }
    .ant-table-fixed-left {
      .ant-table-fixed {
        border: none;
      }
      tr.ant-table-row td {
        font-size: 16px;
        color: @font-color-fixed;
      }
    }
    .ant-table-content {
      thead.ant-table-thead tr th {
        background-color: unset;
        font-size: 16px;
        color: @font-color-head;
        text-align: center;
        .board-view-header-level1 {
          font-size: 20px;
        }
        &:last-of-type {
          border-right: none;
        }
      }
      tbody.ant-table-tbody tr td {
        &.board-view-data {
          border-right: none;
          border-bottom: none;
        }
        &.board-view-data-level-first {
          border-left: 1px solid #e8e8e8;
        }
      }
      .ant-table-fixed-columns-in-body div:first-child {
        width: 69px;
      }
    }
  }
}
</style>
