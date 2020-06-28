export default `<template>
  <div>
    <a-page-header
      title="数字验证"
      sub-title="常用数字验证"
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
        <!-- max验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="max验证（≤10）"
            prop="max"
            :rules="[
              $v.required('必须填写'),
              $v.max(10, '最大值不得超过{{max}}')
            ]"
          >
            <a-input-number
              v-model="record.max"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- min验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="min验证（≥10）"
            prop="min"
            :rules="[
              $v.required('必须填写'),
              $v.min(10, '最小值不得低于{{min}}')
            ]"
          >
            <a-input-number
              v-model="record.min"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- lte验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="lte验证（≤10）"
            prop="lte"
            :rules="[
              $v.required('必须填写'),
              $v.lte(10, '输入值需≤{{max}}')
            ]"
          >
            <a-input-number
              v-model="record.lte"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- gte验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="gte验证（≥10）"
            prop="gte"
            :rules="[
              $v.required('必须填写'),
              $v.gte(10, '输入值需≥{{min}}')
            ]"
          >
            <a-input-number
              v-model="record.gte"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- lt验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="lt验证（<10）"
            prop="lt"
            :rules="[
              $v.required('必须填写'),
              $v.lt(10, '输入值需<{{max}}')
            ]"
          >
            <a-input-number
              v-model="record.lt"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- gt验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="gt验证（>10）"
            prop="gt"
            :rules="[
              $v.required('必须填写'),
              $v.gt(10, '输入值需>{{min}}')
            ]"
          >
            <a-input-number
              v-model="record.gt"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- eq验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="eq验证（=10）"
            prop="eq"
            :rules="[
              $v.required('必须填写'),
              $v.eq(10, '输入值需={{value}}')
            ]"
          >
            <a-input-number
              v-model="record.eq"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- ne验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="ne验证（≠10）"
            prop="ne"
            :rules="[
              $v.required('必须填写'),
              $v.ne(10, '输入值需≠{{value}}')
            ]"
          >
            <a-input-number
              v-model="record.ne"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- range验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="range验证（≥0, ≤10）"
            prop="range"
            :rules="[
              $v.required('必须填写'),
              $v.range([0, 10], '输入值需在[{{min}}, {{max}}]范围内')
            ]"
          >
            <a-input-number
              v-model="record.range"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- gtlt验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="gtlt验证（>0, <10）"
            prop="gtlt"
            :rules="[
              $v.required('必须填写'),
              $v.gtlt([0, 10], '输入值需在({{min}}, {{max}})范围内')
            ]"
          >
            <a-input-number
              v-model="record.gtlt"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- lgte验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="lgte验证（≥0, <10）"
            prop="lgte"
            :rules="[
              $v.required('必须填写'),
              $v.lgte([0, 10], '输入值需在[{{min}}, {{max}})范围内')
            ]"
          >
            <a-input-number
              v-model="record.lgte"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- glte验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="glte验证（>0, ≤10）"
            prop="glte"
            :rules="[
              $v.required('必须填写'),
              $v.glte([0, 10], '输入值需在({{min}}, {{max}}]范围内')
            ]"
          >
            <a-input-number
              v-model="record.glte"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- divisible验证 -->
        <a-col :span="formItemSpan">
          <a-form-model-item
            label="divisible验证（被10整除）"
            prop="divisible"
            :rules="[
              $v.required('必须填写'),
              $v.divisible(10, '输入值必须被{{value}}整除')
            ]"
          >
            <a-input-number
              v-model="record.divisible"
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
            max: 100,
            min: 8,
            lte: 18,
            gte: 8,
            lt: 10,
            gt: 10,
            eq: 100,
            ne: 10,
            range: 100,
            gtlt: 10,
            lgte: 10,
            glte: 0,
            divisible: 13,
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
