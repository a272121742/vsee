<template>
  <a-form
    :form="form"
    layout="horizontal"
    self-update
    class="demo-dynamic-form form-column-split-compact form-column-align"
  >
    <a-row>
      <a-button-group>
        <a-button
          :disabled="action"
          @click="commit"
        >
          提交
        </a-button>
        <a-button
          :disabled="action"
          @click="load"
        >
          加载
        </a-button>
        <a-button
          :disabled="action"
          @click="reset"
        >
          重置
        </a-button>
        <a-button
          :disabled="action"
          @click="clear"
        >
          清空
        </a-button>
      </a-button-group>
    </a-row>
    <a-row :gutter="24">
      <!-- 备注清单 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item label="备注清单">
          <template
            v-for="(value, index) in formRecord['备注清单'] || []"
          >
            <a-input-group
              :key="`input-${index}`"
              class="demo-dynamic-form-single-input"
              compact
            >
              <a-input
                v-decorator="[`备注清单[${index}]`, { initialValue: value }]"
                :placeholder="$t('form.input')"
                allow-clear
              />
              <a-button
                icon="plus-circle"
                @click="() => add(formRecord['备注清单'], index + 1)"
              />
              <a-button
                icon="minus-circle"
                @click="() => remove(formRecord['备注清单'], index)"
              />
            </a-input-group>
          </template>
          <a-button
            v-if="!formRecord['备注清单'] || !formRecord['备注清单'].length"
            class="add-form-item-btn"
            icon="plus"
            type="dashed"
            block
            @click="(e) => add(formRecord['备注清单'], formRecord['备注清单'] ? formRecord['备注清单'].length : 0, null, e)"
          />
        </a-form-item>
      </a-col>
      <a-col :span="formItemSpan * 2">
        <a-form-item label="联系人">
          <template
            v-for="(value, index) in formRecord['联系人'] || []"
          >
            <a-input-group
              :key="`input-${index}`"
              class="demo-dynamic-form-double-input"
              compact
            >
              <a-input
                v-decorator="[`联系人[${index}.name]`, { initialValue: value.name }]"
                placeholder="请输入姓名"
                allow-clear
              />
              <a-input
                v-decorator="[`联系人[${index}.phone]`, { initialValue: value.phone }]"
                placeholder="请输入电话"
                allow-clear
              />
              <a-button
                icon="plus-circle"
                @click="() => add(formRecord['联系人'], index + 1, {})"
              />
              <a-button
                icon="minus-circle"
                @click="() => remove(formRecord['联系人'], index)"
              />
            </a-input-group>
          </template>
          <a-button
            v-if="!formRecord['联系人'] || !formRecord['联系人'].length"
            class="add-form-item-btn"
            icon="plus"
            type="dashed"
            block
            @click="(e) => add(formRecord['联系人'], formRecord['联系人'] ? formRecord['联系人'].length : 0, {}, e)"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <!-- 是否驳回 -->
      <a-col :span="formItemSpan * 4">
        <a-form-item label="是否驳回">
          <a-checkbox v-model="isReject"></a-checkbox>
        </a-form-item>
      </a-col>
      <!-- 驳回理由 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item
          v-if="isReject"
          label="驳回理由"
        >
          <v-textarea
            v-decorator="['驳回理由']"
            :auto-size="{ minRows: 4 }"
            :limit="1000"
            row
            helper-out
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 附件 -->
      <a-col :span="formItemSpan * 2">
        <a-form-item
          v-if="isReject"
          label="附件"
        >
          <v-upload
            v-decorator="['附件', { initialValue: formRecord.files }]"
            :headers="headers"
            :multiple="true"
            :action="$store.getters.getUrl('/field-q/v1/file/upload?recType=30021001')"
            download="/oss/ossFile/download"
          >
            <a-button icon="upload">
              {{ $t('action.upload') }}
            </a-button>
          </v-upload>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record-mix.js';
import attachmentMix from '@mix/attachment.js';

const fields = ['备注清单', '联系人', '驳回理由', '附件'];
const demoData = {
  备注清单: ['朝辞白帝彩云间', '潜力降临一日还', '两岸猿声啼不住', '轻舟已过万重山'],
  联系人: [{ name: '张三', phone: '13000000000' }, { name: '王五', phone: '13112345678' }],
  驳回理由: '驳回理由',
  附件: [{
    id: '1266238604047335425', fileName: '涉及文件更新01.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/654833642f8f4a85bf602cfda538a7d6.png', recId: null, recType: '30021001', fileSize: '1937',
  }, {
    id: '1266238604076695553', fileName: '涉及文件更新02.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/6c017487a33e4b1d9c22acf4108af441.png', recId: null, recType: '30021001', fileSize: '1937',
  }, {
    id: '1266238604160581633', fileName: '涉及文件更新03.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/c7a718de59f448fe868c7df3e137250c.png', recId: null, recType: '30021001', fileSize: '1937',
  }, {
    id: '1266238604282216450', fileName: '涉及文件更新04.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/6d2a10952678488594e4ff1cb850fb6a.png', recId: null, recType: '30021001', fileSize: '1937',
  }],
};

export default {
  mixins: [
    formRecordMix('form', fields),
    attachmentMix,
  ],
  data () {
    return {
      formItemSpan: 6,
      isReject: false,
      action: false,
      formRecord: {
        备注清单: [],
        联系人: [],
      },
    };
  },
  methods: {
    add (list = [], index = 0, type = null) {
      console.log(index, type);
      list.splice(index, 0, type);
    },
    remove (list = [], index = -1) {
      console.log(index);
      list.splice(index, 1);
    },
    commit () {
      if (!this.action) {
        this.action = true;
        this.$message.show({
          content: this.formRecord,
          duration: 2,
          onClose: () => {
            this.action = false;
          },
        });
        console.log(this.formRecord);
        console.log(this.form.getFieldsValue());
      }
    },
    load () {
      if (!this.action) {
        this.action = true;
        this.$message.show({
          content: '正在请求数据',
          duration: 2,
          onClose: () => {
            this.form.set(demoData, true);
            this.isReject = !!demoData['驳回理由'];
            this.action = false;
          },
        });
      }
    },
    reset () {
      this.form.reset();
    },
    clear () {
      this.form.clear();
    },
  },
};
</script>

<style lang="less" scoped>
.demo-dynamic-form {
  .add-form-item-btn {
    width: calc(100% - 32px);
  }
  .a-icon {
    cursor: pointer;
  }
  .ant-input-group-compact {
    &.demo-dynamic-form-single-input > :first-child {
      width: calc(100% - 64px);
      margin-right: 0;
      border-radius: @border-radius-base;
    }
    &.demo-dynamic-form-double-input > :first-child {
      width: calc((100% - 64px) * 2 / 5);
    }
    &.demo-dynamic-form-double-input > :nth-child(2) {
      width: calc((100% - 64px) * 3 / 5);
      margin-right: 0;
      border-top-right-radius: @border-radius-base;
      border-bottom-right-radius: @border-radius-base;
    }
    .ant-btn {
      border: none;
    }
  }
}
</style>
