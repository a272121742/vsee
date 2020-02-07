<template>
  <a-form
    :form="dialogForm"
    class="col-layout-form col-layout-search-form"
    layout="vertical"
    self-update
  >
    <!-- {{ record }} -->
    <a-row :gutter="24">
      <!-- 车型 -->
      <a-col :span="formItemSpan">
        <a-form-item
          :label="$t('issue.vhclSeriesCode')"
        >
          <multiple-net-select
            v-decorator="['vhclSeriesCode']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="vhclSeriesCode"
            :label-of="(item) => item.vhclSeriesCode"
            allow-clear
            search-by="name"
            :max-tag-count="2"
          />
        </a-form-item>
      </a-col>
      <!-- VIN -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.vinTit')">
          <a-input
            v-decorator="['vin']"
            placeholder="请输入"
            autocomplete="off"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 电池 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.batteryCode')">
          <multiple-net-select
            v-decorator="['batteryCode']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/batteryAndCode"
            value-by="batteryCode"
            :max-tag-count="0"
            :label-of="(item) => item.batteryCode"
            allow-clear
            search-by="code"
          />
        </a-form-item>
      </a-col>
      <!-- 下线工厂 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.factoryName')">
          <single-net-select
            v-decorator="['factoryName']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=factory_code"
            value-by="dictName"
            :label-of="(item) => item.dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>
      <!-- 生产日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.prodDate')">
          <a-range-picker
            v-decorator="[
              'prodDate'
            ]"
            :get-calendar-container="e => e.parentNode"
          />
        </a-form-item>
      </a-col>
      <!-- 销售日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.salesDate')">
          <a-range-picker
            v-decorator="[
              'warrantyBeginDate'
            ]"
            :get-calendar-container="e => e.parentNode"
          />
        </a-form-item>
      </a-col>
      <!-- 车辆用途 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.carUsageCode')">
          <multiple-net-select
            v-decorator="['carUsageCode']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=car_usage_code"
            value-by="dictValue"
            :label-of="(item) => item.dictName"
            allow-clear
            close-search
          />
        </a-form-item>
      </a-col>

      <div class="col-layout-form-actions">
        <a-button
          type="primary"
          @click="getDialogSearch"
        >
          {{ $t('action.find') }}
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="dialogRest"
        >
          {{ $t('action.reset') }}
        </a-button>
      </div>
    </a-row>
  </a-form>
</template>

<script>
import formRecordMix from '@mix/form-record.js';
import timeFormatMix from '@mix/time-format.js';

const fileds = ['vin', 'batteryCode', 'factoryName', 'prodDate', 'warrantyBeginDate', 'carUsageCode', 'vhclSeriesCode'];

export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    formRecordMix('dialogForm', fileds),
    timeFormatMix,
  ],
  data () {
    return {
      formItemSpan: 6,
    };
  },
  methods: {
    getDialogSearch () {
      this.transformMomentDate(this.dialogFormRecord, 'prodDate');
      this.transformMomentDate(this.dialogFormRecord, 'warrantyBeginDate');
      const vehicleInforSearch = { ...this.dialogFormRecord };
      this.$store.commit('issue/set', { vehicleInforSearch });
    },
    dialogRest () {
      this.dialogForm.reset();
      this.$store.commit('issue/set', { vehicleInforSearch: {} });
    },
  },
};
</script>
<style lang="less" scoped>
  .col-layout-form-actions {
    .ant-btn {
      margin-left: 8px;
    }
  }
</style>
