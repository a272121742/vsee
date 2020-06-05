<template>
  <div class="root">
    <h2 class="title">
      <a-icon type="icon-single-bs-filled"></a-icon>
      {{ $t('issue.initialAnalysis') }}
    </h2>
    <a-form-model
      ref="initialAnalysisForm"
      :model="initialAnalysisForm"
      layout="inline"
      :label-col=" {span: 3} "
      :wrapper-col="{ span: 21 }"
      class="form-column-align"
    >
      <a-row>
        <a-col :span="24">
          <a-form-model-item
            prop="originalAnalysis"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.initialAnalysis')"
          >
            <v-textarea
              v-model="initialAnalysisForm.originalAnalysis"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
</template>

<script>
import { validator } from '@util/formhelper.js';
import { pick } from 'ramda';

const fileds = ['originalAnalysis'];


export default {
  mixins: [validator],
  props: {
    mergeData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      initialAnalysisForm: {},
    };
  },
  watch: {
    mergeData: {
      immediate: true,
      handler (mergeData = {}) {
        this.initialAnalysisForm = pick(fileds, mergeData);
      },
    },
  },
  methods: {
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.$refs.initialAnalysisForm.validate((valid) => {
          if (valid) {
            const initialAnalysisList = { ...this.initialAnalysisForm };
            resolve(initialAnalysisList);
          } else {
            reject(valid);
          }
          return valid;
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.root {
  .ant-input {
    height: 56px;
  }
  .title {
    display: flex;
    align-items: center;
    height: 14px;
    line-height: 14px;
    margin: 0 0 16px 0;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    /deep/ .anticon {
      color: @primary-color;
    }
  }
  .title-icon {
    display: inline-block;
    width: 4px;
    height: 14px;
    background-color: #0097e0;
    margin-right: 5px;
  }
  /deep/ .ant-form-item {
    margin: 0;
  }
  /deep/ .ant-form-item-label {
    width: 120px;
    text-align: right;
    flex: initial !important;
  }
}
</style>
