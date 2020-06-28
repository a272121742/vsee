export default `<template>
<div>
  <a-page-header
    title="其他验证"
    sub-title="常用于本地自定义验证和远程服务端验证"
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
    ref="form"
    :model="record"
    layout="vertical"
  >
    <a-row :gutter="24">
      <!-- custom验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="custom验证"
          prop="custom"
          required
          :rules="[
            $v.custom(custValidate, '必须填写')
          ]"
        >
          <a-input
            v-model="record.custom"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- remote验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="remote验证"
          prop="remote"
          :rules="[
            $v.required('必须填写'),
            $v.remote({ url: '/issue/v1/workflow/getCorrelationIssue', query: { id: '{{value}}' }, success: remoteValidCallback })
          ]"
        >
          <a-input
            v-model="record.remote"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
    </a-row>
  </a-form-model>
</div>
</template>

<script>
import formRecord from '@mix/form-model-record.js';
import code from './OtherValidate.code.js';

export default {
components: {
  SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
},
mixins: [
  formRecord(),
],
data () {
  return {
    showSource: false,
    code,
    action: false,
    formItemSpan: 6,
  };
},
methods: {
  // 提交数据
  commit () {
    this.form.validate((valid) => {
      if (valid) {
        const commitValue = this.record.valueOf();
        if (!this.action) {
          this.action = true;
          this.$message.loading(\`正在提交数据\${JSON.stringify(commitValue)}\`, 2, () => {
            this.action = false;
          });
        }
        console.log('提交的数据为', commitValue);
      }
      return valid;
    });
  },
  // 加载数据
  load () {
    this.$message.loading('正在添加假数据', 0.8);
    if (!this.action) {
      this.action = true;
      const id = setTimeout(() => {
        this.record.load({
        });
        this.action = false;
        clearTimeout(id);
      }, 800);
    }
  },
  // 重置数据
  reset () {
    this.form.clearValidate();
    this.record.reset();
  },
  // 清空数据
  clear () {
    this.form.clearValidate();
    this.record.clear();
  },
  // 缓存数据
  cache () {
    this.record.cache();
  },
  // 自定义验证
  custValidate (rule, val) {
    return !!val;
  },
  // 远程验证回调
  remoteValidCallback (res) {
    if (res && !res.length) {
      return '数据为空';
    }
    return true;
  },
},
};
</script>
`;
