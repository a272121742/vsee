<template>
  <div>
    <a-page-header
      title="字符串验证"
      sub-title="常用字符串验证"
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
        <!-- maxLen验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="maxLen验证（长度≤4）"
            prop="maxLen"
            :rules="[
              $v.required('必须填写'),
              $v.maxLen(4, '最大长度不得超过{{max}}')
            ]"
          >
            <a-input
              v-model="record.maxLen"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- minLen验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="minLen验证（长度≥4）"
            prop="minLen"
            :rules="[
              $v.required('必须填写'),
              $v.minLen(4, '最小长度不得低于{{min}}')
            ]"
          >
            <a-input
              v-model="record.minLen"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- rangeLen验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="rangeLen验证（长度≥4, ≤8）"
            prop="rangeLen"
            :rules="[
              $v.required('必须填写'),
              $v.rangeLen([4, 8], '输入长度需在{{min}}~{{max}}位之间')
            ]"
          >
            <a-input
              v-model="record.rangeLen"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- len验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="len验证（长度=4）"
            prop="len"
            :rules="[
              $v.required('必须填写'),
              $v.len(4, '输入长度必须等于{{len}}')
            ]"
          >
            <a-input
              v-model="record.len"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- enum验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="enum验证"
            prop="enum"
            :rules="[
              $v.required('必须填写'),
              $v.enum(['男', '女'], '输入值不在{{list}}范围中')
            ]"
          >
            <a-input
              v-model="record.enum"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- prefix验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="prefix验证"
            prop="prefix"
            :rules="[
              $v.required('必须填写'),
              $v.prefix('@', '输入值必须以{{txt}}开头')
            ]"
          >
            <a-input
              v-model="record.prefix"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- suffix验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="suffix验证"
            prop="suffix"
            :rules="[
              $v.required('必须填写'),
              $v.suffix('%', '输入值必须以{{txt}}结尾')
            ]"
          >
            <a-input
              v-model="record.suffix"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- include验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="include验证"
            prop="include"
            :rules="[
              $v.required('必须填写'),
              $v.include('@aas.com', '输入值必须包含{{txt}}')
            ]"
          >
            <a-input
              v-model="record.include"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- exclude验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="exclude验证（不能带有'密码'两字）"
            prop="exclude"
            :rules="[
              $v.required('必须填写'),
              $v.exclude('密码', '输入值不能包含\'{{txt}}\'关键字')
            ]"
          >
            <a-input
              v-model="record.exclude"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- unique验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="unique验证"
            prop="unique"
            :rules="[
              $v.required('必须填写'),
              $v.unique('输入值包含重复项')
            ]"
          >
            <a-input
              v-model="record.unique"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- within验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="within验证（区别于enum）"
            prop="within"
            :rules="[
              $v.required('必须填写'),
              $v.within(['男', '女'], '输入值不在{{list}}范围中')
            ]"
          >
            <a-input
              v-model="record.within"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- without验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="without验证（不能带脏字）"
            prop="without"
            :rules="[
              $v.required('必须填写'),
              $v.without(['操', '草', '艹'], '输入值不能包含{{list}}')
            ]"
          >
            <a-input
              v-model="record.without"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- without验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="pattern验证（/^[a-zA-Z ]+$/g）"
            prop="pattern"
            :rules="[
              $v.required('必须填写'),
              $v.pattern(/^[a-zA-Z ]+$/g, '输入值不符合正则验证规则')
            ]"
          >
            <a-input
              v-model="record.pattern"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- includeZh验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="includeZh验证（包含中文）"
            prop="includeZh"
            :rules="[
              $v.required('必须填写'),
              $v.includeZh('必须包含中文')
            ]"
          >
            <a-input
              v-model="record.includeZh"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- onlyZh验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="onlyZh验证（只包含中文）"
            prop="onlyZh"
            :rules="[
              $v.required('必须填写'),
              $v.onlyZh('只能包含中文')
            ]"
          >
            <a-input
              v-model="record.onlyZh"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- excludeZh验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="excludeZh验证（只包含中文）"
            prop="excludeZh"
            :rules="[
              $v.required('必须填写'),
              $v.excludeZh('不能包含中文')
            ]"
          >
            <a-input
              v-model="record.excludeZh"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- maybeDByte验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="maybeDByte验证（双字节）"
            prop="maybeDByte"
            :rules="[
              $v.required('必须填写'),
              $v.maybeDByte('只能是双字节文字')
            ]"
          >
            <a-input
              v-model="record.maybeDByte"
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
import code from './StringValidate.code.js';

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
            maxLen: 'abcdefg',
            minLen: 'abc',
            rangeLen: 'abc',
            len: 'abcde',
            enum: '不明',
            prefix: '!张三',
            suffix: '100℃',
            include: '169@163.com',
            exclude: '重置密码项',
            unique: 'abdcda',
            within: '不明',
            without: '艹',
            pattern: '123',
            includeZh: 'abc',
            onluZh: 'abc',
            excludeZh: '中文',
            maybeDByte: 'abc',
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
