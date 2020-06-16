export default `<template>
  <div>
    <a-page-header
      title="动态表单"
      sub-title="内置form-record支持动态表单绑值"
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
          <a-button
            :disabled="action"
            @click="cache"
          >
            缓存
          </a-button>
        </a-button-group>
      </template>
    </a-page-header>
    <a-form-model
      :model="record"
      layout="horizontal"
      class="demo-dynamic-form form-column-split-compact form-column-align"
    >
      <a-row :gutter="24">
        <!-- 备注清单 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item label="备注清单">
            <template
              v-for="(value, index) in record['备注清单'] || $set(record, '备注清单', [])"
            >
              <a-input-group
                :key="\`input-\${index}\`"
                class="demo-dynamic-form-single-input"
                compact
              >
                <a-input
                  v-model="record['备注清单'][index]"
                  :placeholder="$t('form.input')"
                  allow-clear
                />
                <a-button
                  icon="plus-circle"
                  @click="() => add(record['备注清单'], index + 1)"
                />
                <a-button
                  icon="minus-circle"
                  @click="() => remove(record['备注清单'], index)"
                />
              </a-input-group>
            </template>
            <a-button
              v-if="!record['备注清单'] || !record['备注清单'].length"
              class="add-form-item-btn"
              icon="plus"
              type="dashed"
              block
              @click="(e) => add(record['备注清单'], record['备注清单'] ? record['备注清单'].length : 0, null, e)"
            />
          </a-form-model-item>
        </a-col>
        <a-col :span="formItemSpan * 2">
          <a-form-model-item label="联系人">
            <template
              v-for="(value, index) in record['联系人'] || $set(record, '联系人', [])"
            >
              <a-input-group
                :key="\`input-\${index}\`"
                class="demo-dynamic-form-double-input"
                compact
              >
                <a-input
                  v-model="record['联系人'][index].name"
                  placeholder="请输入姓名"
                  allow-clear
                />
                <a-input
                  v-model="record['联系人'][index].phone"
                  placeholder="请输入电话"
                  allow-clear
                />
                <a-button
                  icon="plus-circle"
                  @click="() => add(record['联系人'], index + 1, {})"
                />
                <a-button
                  icon="minus-circle"
                  @click="() => remove(record['联系人'], index)"
                />
              </a-input-group>
            </template>
            <a-button
              v-if="!record['联系人'] || !record['联系人'].length"
              class="add-form-item-btn"
              icon="plus"
              type="dashed"
              block
              @click="(e) => add(record['联系人'], record['联系人'] ? record['联系人'].length : 0, {}, e)"
            />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <!-- 是否驳回 -->
        <a-col :span="formItemSpan * 4">
          <a-form-model-item label="是否驳回">
            <a-checkbox v-model="record['是否驳回']"></a-checkbox>
          </a-form-model-item>
        </a-col>
        <!-- 驳回理由 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            v-if="record['是否驳回']"
            label="驳回理由"
          >
            <v-textarea
              v-model="record['驳回理由']"
              :auto-size="{ minRows: 4 }"
              :limit="1000"
              row
              helper-out
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 附件 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            v-if="record['是否驳回']"
            label="附件"
          >
            <v-upload
              v-model="record['附件']"
              :headers="headers"
              :multiple="true"
              :action="$store.getters.getUrl('/field-q/v1/file/upload?recType=30021001')"
              download="/oss/ossFile/download"
            >
              <a-button icon="upload">
                {{ $t('action.upload') }}
              </a-button>
            </v-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import formRecord from '@mix/form-model-record.js';
import attachmentMix from '@mix/attachment.js';
import code from './DynamicForm.code.js';

export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    formRecord('record'),
    attachmentMix,
  ],
  data () {
    return {
      formItemSpan: 6,
      showSource: false,
      code,
      action: false,
    };
  },
  methods: {
    // 添加动态项
    add (list = [], index = 0, type = null) {
      list.splice(index, 0, type);
    },
    // 移除动态项
    remove (list = [], index = -1) {
      list.splice(index, 1);
    },
    // 提交数据
    commit () {
      const commitValue = this.record.valueOf(function map () {
        if (!this['是否驳回']) {
          this['驳回理由'] = null;
          this['附件'] = null;
        }
      });
      if (!this.action) {
        this.action = true;
        this.$message.loading(\`正在提交数据\${JSON.stringify(commitValue)}\`, 2, () => {
          this.action = false;
        });
      }
      console.log(commitValue);
    },
    // 加载数据
    load () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const id = setTimeout(() => {
          this.record.load({
            备注清单: ['朝辞白帝彩云间', '潜力降临一日还', '两岸猿声啼不住', '轻舟已过万重山'],
            联系人: [{ name: '张三', phone: '13000000000' }, { name: '王五', phone: '13112345678' }],
            是否驳回: true,
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
          });
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    // 重置数据
    reset () {
      this.record.reset();
    },
    // 清空数据
    clear () {
      this.record.clear();
    },
    // 缓存数据
    cache () {
      this.record.cache();
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
</style>`;
