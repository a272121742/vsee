<template>
  <div class="root">
    <a-form
      :form="enterVehicleInfForm"
      layout="inline"
      :label-col="{span:3}"
      :wrapper-col="{span:21}"
      self-update
      class="col-layout-form"
    >
      <a-row>
        <!-- 环境 -->
        <a-col :span="24">
          <a-form-item
            required
            :label="$t('issue.env')"
          >
            <v-textarea
              v-decorator="[
                'env',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]}
              ]"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <!-- 数据分析 -->
        <a-col :span="24">
          <a-form-item
            required
            :label="$t('issue.envhclInfov')"
          >
            <v-textarea
              v-decorator="[
                'vhclInfo',{
                  rules: [
                    $v.required($t('issue.notBeBlank'))
                  ]}
              ]"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
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

const fileds = ['env', 'vhclInfo'];
export default {
  components: {
    VTextarea: () => import('@comp/form/VTextarea.vue'),
  },
  mixins: [formRecordMix('enterVehicleInfForm', fileds)],
  props: {
    envAndIfoData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
    };
  },
  watch: {
    envAndIfoData: {
      immediate: true,
      handler (envAndIfoData = {}) {
        this.enterVehicleInfFormRecord = pick(fileds, envAndIfoData);
      },
    },
  },
  methods: {
    getEnvAndInfoData () {
      return new Promise((resolve, reject) => {
        this.enterVehicleInfForm.validateFields((err) => {
          if (!err) {
            const enterVehicleList = { ...this.enterVehicleInfFormRecord };
            this.$store.commit('issue/set', { enterVehicleList });
            resolve(enterVehicleList);
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
  margin-bottom: 24px;
  margin-top: 24px;
  /deep/ .ant-form-item {
    margin-right: 0;
  }
  /deep/ .ant-form-item-label {
    width: 120px;
    text-align: right;
    flex: initial !important;
  }
}
</style>
