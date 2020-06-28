export default `<template>
<div>
  <a-page-header
    title="类型验证"
    sub-title="常用于一些普通类型或者业务类型验证"
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
      <!-- int验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="int验证"
          prop="int"
          :rules="[
            $v.required('必须填写'),
            $v.int('只能是整数')
          ]"
        >
          <a-input-number
            v-model="record.int"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- float验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="float验证"
          prop="float"
          :rules="[
            $v.required('必须填写'),
            $v.float('只能是小数')
          ]"
        >
          <a-input-number
            v-model="record.float"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- email验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="email验证"
          prop="email"
          :rules="[
            $v.required('必须填写'),
            $v.email('必须是邮箱格式')
          ]"
        >
          <a-input
            v-model="record.email"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- url验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="url验证"
          prop="url"
          :rules="[
            $v.required('必须填写'),
            $v.url('必须是连接地址')
          ]"
        >
          <a-input
            v-model="record.url"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- hex验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="hex验证"
          prop="hex"
          :rules="[
            $v.required('必须填写'),
            $v.hex('不是十六进制格式')
          ]"
        >
          <a-input
            v-model="record.hex"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- ip验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="ip验证"
          prop="ip"
          :rules="[
            $v.required('必须填写'),
            $v.ip('必须是IP地址')
          ]"
        >
          <a-input
            v-model="record.ip"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- color验证 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          label="color验证"
          prop="color"
          :rules="[
            $v.required('必须填写'),
            $v.color('必须是color格式')
          ]"
        >
          <a-input
            v-model="record.color"
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
import code from './NumberValidate.code.js';

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
          int: '文字',
          float: 1000,
          email: 'http://www.baidu.com',
          url: '163@163.com',
          hex: 'AOP',
          ip: '256.999.800.123',
          color: '红色',
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
},
};
</script>
`;
