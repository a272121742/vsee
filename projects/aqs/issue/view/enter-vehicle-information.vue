<template>
  <div class="root">
    <a-form-model
      ref="enterVehicleInfForm"
      :model="enterVehicleInfForm"
      layout="inline"
      class="form-column-align"
    >
      <a-row>
        <!-- 环境 -->
        <a-col :span="24">
          <a-form-model-item
            prop="env"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.env')"
          >
            <v-textarea
              v-model="enterVehicleInfForm.env"
              :placeholder="$t('form.input')"
              :limit="1000"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 数据分析 -->
        <a-col :span="24">
          <a-form-model-item
            prop="vhclInfo"
            :rules="[$v.required($t('issue.notBeBlank'))]"
            :label="$t('issue.envhclInfov')"
          >
            <v-textarea
              v-model="enterVehicleInfForm.vhclInfo"
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

const fileds = ['env', 'vhclInfo'];
export default {
  mixins: [validator],
  props: {
    envAndIfoData: {
      type: Object,
      default: () => ({}),
    },
  },
  data () {
    return {
      enterVehicleInfForm: {},
    };
  },
  watch: {
    envAndIfoData: {
      immediate: true,
      handler (envAndIfoData = {}) {
        this.enterVehicleInfForm = pick(fileds, envAndIfoData);
      },
    },
  },
  methods: {
    getEnvAndInfoData () {
      return new Promise((resolve, reject) => {
        this.$refs.enterVehicleInfForm.validate((valid) => {
          if (valid) {
            const enterVehicleList = { ...this.enterVehicleInfForm };
            this.$store.commit('issue/set', { enterVehicleList });
            resolve(enterVehicleList);
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
