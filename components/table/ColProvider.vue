<i18n>
  {
    "en": {
      "title": "Custom Columns",
      "save_success": "Save Success!",
      "save_failed": "Save Failed!",
      "columns_updated": "Columns Updated",
      "button_save": "Save",
      "button_cancel": "Cancel",
      "button_reset": "Reset"
    },
    "zh": {
      "title": "自定义列",
      "save_success": "同步成功！",
      "save_failed": "同步失败！",
      "columns_updated": "表格列已更新！",
      "button_save": "保存",
      "button_cancel": "取消",
      "button_reset": "恢复默认"
    }
  }
</i18n>
<template>
  <div
    ref="container"
    class="col-provider"
  >
    <a-popover
      v-model="visible"
      :auto-adjust-overflow="false"
      :arrow-point-at-center="true"
      placement="bottom"
      trigger="click"
    >
      <a-card
        slot="content"
        :title="title || $t('title')"
        :bordered="false"
        class="col-provider-card"
        style="width: 320px;"
      >
        <span slot="extra">
          {{ checked }} / {{ columnList.length }}
        </span>
        <a-row
          type="flex"
        >
          <a-col
            v-for="col in columnList"
            :key="col.title"
            :span="12"
          >
            <a-checkbox
              :value="col.title"
              :checked="!col.invisible"
              @change="e => changeCol(col, e.target.checked)"
            >
              {{ transform(localePath && localePath + '.' + col.dataIndex) }}
            </a-checkbox>
          </a-col>
        </a-row>
        <a-divider style="" />
        <a-row>
          <a-button
            :disabled="!disableCommit && !modified"
            type="primary"
            style="margin-left: 24px"
            @click="commit"
          >
            {{ $t('button_save') }}
          </a-button>
          <a-button @click="hide">
            {{ $t('button_cancel') }}
          </a-button>
          <a-button
            :disabled="!modified"
            style="float: right; margin-right: 24px;"
            @click="recover"
          >
            {{ $t('button_reset') }}
          </a-button>
        </a-row>
      </a-card>
      <a-icon
        type="setting"
        @click="show"
      ></a-icon>
    </a-popover>
  </div>
</template>

<script>
import { clone } from 'ramda';
import $ from '@http';

export default {
  props: {
    /**
     * 标题
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * 传入的列配置项
     */
    columns: {
      type: Array,
      required: true,
      default: () => [],
    },
    /**
     * 国际化转换函数
     */
    transform: {
      type: Function,
      default: (txt) => txt,
    },
    /**
     * 国际化路径
     */
    localePath: {
      type: String,
      default: '',
    },
    /**
     * 请求地址
     */
    url: {
      type: String,
      default: '',
    },
    /**
     * 映射函数
     */
    mapping: {
      type: Function,
      required: true,
    },
    /**
     * 传入给服务端的唯一标识
     */
    id: {
      type: String,
      require: true,
      default: '',
    },
  },
  data () {
    return {
      visible: false,
      /**
       * 时间触发器
       */
      tc: 0,
      /**
       * 列信息备份
       */
      columnList: [],
      /**
       * 禁用提交
       */
      disableCommit: false,
    };
  },
  computed: {
    /**
     * 已选中数目
     */
    checked () {
      return (this.tc, this.columnList.filter((col) => !col.invisible).length);
    },
    /**
     * 是否修改过
     */
    modified () {
      return (this.tc, JSON.stringify(this.columnList) !== JSON.stringify(this.cache));
    },
  },
  created () {
    // 获取数据，如果无后台，将得到`undefined`
    this.fetch().then((cols) => {
      this.columns.forEach((col) => {
        col.invisible = !!col.invisible;
      });
      this.cache = cols || clone(this.columns);
      this.columnList = cols || this.columns;
      this.mapping(clone(this.columnList));
    });
  },
  methods: {
    /**
     * 向后抬发起请求，如果已经配置了URL，则返回服务端数据，否则返回`undefined`
     */
    fetch () {
      return new Promise((resolve) => {
        if (this.url && process.env.NODE_ENV === 'production') {
          $.get(this.url, { listCode: this.id }).then((res) => {
            resolve(JSON.parse(res.expression));
          }).catch(() => {
            resolve();
          });
        } else {
          resolve();
        }
      });
    },
    /**
     * 显示弹窗
     */
    show () {
      this.recover();
      this.tc = Date.now();
    },
    /**
     * 隐藏弹窗
     */
    hide () {
      this.tc = Date.now();
      this.visible = false;
    },
    /**
     * 切换列是否显示
     */
    changeCol (col, status) {
      col.invisible = !status;
      this.tc = Date.now();
    },
    /**
     * 还原原始值
     */
    recover () {
      this.$set(this, 'columnList', clone(this.cache));
    },
    /**
     * 提交数据（已防止二次提交）
     */
    commit () {
      if (!this.disableCommit) {
        this.disableCommit = true;
        if (this.url) {
          $.post(this.url, { listCode: this.id, expression: JSON.stringify(this.columnList) }).then(() => {
            this.cache = clone(this.columnList);
            this.mapping(clone(this.columnList));
            this.$message.success(this.$t('save_success'));
          }).catch(() => {
            this.$message.error(this.$t('save_failed'));
            this.mapping(clone(this.cache));
            this.recover();
          }).finally(() => {
            this.disableCommit = false;
            this.hide();
          });
        } else {
          const columnList = clone(this.columnList);
          this.mapping(columnList);
          this.cache = columnList;
          this.hide();
          this.$nextTick(() => {
            this.$message.success(this.$t('columns_updated'));
            this.disableCommit = false;
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
 .col-provider-card {
   margin: -12px -16px;
   /deep/ .ant-card-head-title {
     padding: 12px 0px;
   }
   /deep/ .ant-card-body {
     padding: 12px 0px;
   }
   /deep/ .ant-divider-horizontal {
     margin: 12px 0px;
   }
   /deep/ .ant-col-12 {
    width: calc(50% - 48px);
    margin: 4px 24px;
   }
 }
</style>
