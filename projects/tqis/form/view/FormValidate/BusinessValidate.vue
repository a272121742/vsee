<template>
  <div>
    <a-page-header
      title="业务验证"
      sub-title="常用于业务数据的验证，这些验证是可以被重写的"
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
        <!-- idcard验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="idcard验证"
            prop="idcard"
            :rules="[
              $v.required('必须填写'),
              $v.idcard('必须满足身份格式')
            ]"
          >
            <a-input
              v-model="record.idcard"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- phone验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="phone验证"
            prop="phone"
            :rules="[
              $v.required('必须填写'),
              $v.phone('必须满足手机格式')
            ]"
          >
            <a-input
              v-model="record.phone"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- mobile验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="mobile验证"
            prop="mobile"
            :rules="[
              $v.required('必须填写'),
              $v.mobile('必须满足手机格式')
            ]"
          >
            <a-input
              v-model="record.mobile"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- username验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="username验证"
            prop="username"
            :rules="[
              $v.required('必须填写'),
              $v.username('必须满足用户名格式要求')
            ]"
          >
            <a-input
              v-model="record.username"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- password验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="password验证"
            prop="password"
            :rules="[
              $v.required('必须填写'),
              $v.password('必须满足密码格式要求')
            ]"
          >
            <a-input-password
              v-model="record.password"
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
            this.$message.loading(`正在提交数据${JSON.stringify(commitValue)}`, 2, () => {
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
            idcard: 'abdcefg',
            phone: 'abdcefg',
            mobile: 'abdcefg',
            username: 'U&(*&!',
            password: 'abcdefg(U&(*&!',
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
