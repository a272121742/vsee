<template>
  <div class="root">
    <h2 class="title">
      <a-icon type="iconbs_filled"></a-icon>
      {{ $t('issue.temporaryMeasures') }}
    </h2>
    <a-form
      :form="temporaryMeasuresForm"
      layout="inline"
      :label-col="{span:3}"
      :wrapper-col="{span:21}"
      self-update
      class="col-layout-form"
    >
      <a-row>
        <a-col :span="24">
          <a-form-item
            required
            :label="$t('issue.temporaryMeasures')"
          >
            <v-textarea
              v-decorator="[
                'tempSolution',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]}
              ]"
              :placeholder="$t('form.input')"
              :limit="1000"
              auto-clear
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import formRecordMix from '@mix/form-record.js';
import { pick } from 'ramda';

const fileds = ['tempSolution'];

export default {
  components: {
    VTextarea: () => import('@comp/form/VTextarea.vue'),
  },
  mixins: [formRecordMix('temporaryMeasuresForm', fileds)],
  props: {
    mergeData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
    };
  },
  watch: {
    mergeData: {
      immediate: true,
      handler (mergeData = {}) {
        this.temporaryMeasuresFormRecord = pick(fileds, mergeData);
      },
    },
  },
  methods: {
    /**
     * 获取表单数据，返回给上层组件使用
     */
    getData () {
      return new Promise((resolve, reject) => {
        this.temporaryMeasuresForm.validateFieldsAndScroll((err) => {
          if (!err) {
            const temporaryMeasuresList = { ...this.temporaryMeasuresFormRecord };
            resolve(temporaryMeasuresList);
          } else {
            reject(err);
          }
        });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.root {
  margin-bottom: 32px;
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
