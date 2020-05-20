<template>
  <!-- 车辆查询表单  -->
  <a-form
    :form="vehicleForm"
    class="col-layout-form col-layout-search-form"
    layout="vertical"
    self-update
  >
    <a-row :gutter="24">
      <!-- 车型 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.vhclSeriesCode')">
          <multiple-net-select
            v-decorator="['vhclSeriesCode']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="id"
            :label-of="(item) => item.vhclSeriesCode"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
      <!-- 车型代码 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.vhclModelCode')">
          <single-net-select
            v-decorator="['vhclModelCode']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelCode"
            :label-of="(item) => item.vhclModelCode"
            allow-clear
            search-by="code"
          />
        </a-form-item>
      </a-col>
      <!-- 车型名称 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.vhclModelName')">
          <single-net-select
            v-decorator="['vhclModelName']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelName"
            :label-of="(item) => item.vhclModelName"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 下线工厂 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.factoryName')">
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
      <!-- 颜色名称 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.colorName')">
          <single-net-select
            v-decorator="['colorName']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/colorNameAndCode"
            value-by="colorName"
            :label-of="(item) => item.colorName"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- vin -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.vin')">
          <a-input
            v-decorator="['vin']"
            placeholder="请输入"
            autocomplete="off"
            allow-clear
            search-by="name"
          />
        </a-form-item>
      </a-col>
      <!-- 出厂日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.prodDate')">
          <a-range-picker
            v-decorator="[
              'prodDate'
            ]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 质保起始日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('vehicle.salesDate')">
          <a-range-picker
            v-decorator="[
              'warrantyBeginDate'
            ]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 功能按钮区域 -->
      <div class="col-layout-form-actions">
        <!-- 查询按钮 -->
        <a-button
          type="primary"
          @click="vehicleSearch"
        >
          {{ $t('action.find') }}
        </a-button>
        <!-- 重置按钮 -->
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="vehicleReset"
        >
          {{ $t('action.reset') }}
        </a-button>
        <!-- 导出按钮 -->
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="vehicleExport"
        >
          {{ $t('action.export') }}
        </a-button>
      </div>
    </a-row>
  </a-form>
</template>

<script>
import { omit } from 'ramda';
import storeModuleMix from '@mix/store-module.js';
import formRecordMix from '@mix/form-record-mix.js';
import timeFormatMix from '@mix/time-format.js';

// 排除参数不传入接口
const omitSearchFields = omit(['prodDate', 'warrantyBeginDate']);


export default {
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'vehicle',
      action: ['getVehicleExportData'],
    }),
    formRecordMix('vehicleForm'),
    timeFormatMix,
  ],
  data () {
    return {
      formItemSpan: 6,
    };
  },
  methods: {
    /**
     * 车辆查询
     */
    vehicleSearch () {
      const vehicleSearchList = this.getQuery();
      this.$store.commit('vehicle/set', { vehicleSearchList });
    },
    /**
     * 重置
     */
    vehicleReset () {
      this.vehicleForm.reset();
      this.$store.commit('vehicle/set', { vehicleSearchList: {} });
    },
    /**
     * 导出
     */
    vehicleExport () {
      const vehicleSearchList = this.getQuery();
      this.getVehicleExportData(vehicleSearchList).then();
    },
    /**
     * 处理查询参数，其中时间格式Moment会转换成字符串或者数字
     */
    getQuery () {
      // `transformMomentDate`自动处理`prodDate`参数为`prodDateStart`、`prodDateEnd`格式
      this.transformMomentDate(this.vehicleFormRecord, 'prodDate');
      this.transformMomentDate(this.vehicleFormRecord, 'warrantyBeginDate');
      return omitSearchFields(this.vehicleFormRecord);
    },
  },
};
</script>
<style lang="less" scoped>
.form-buttons-warpper {
  float: right;
  .ant-btn {
    margin-left: 12px;
  }
}
/deep/ .ant-select-dropdown-menu-root {
  overflow: visible;
  .ant-select-dropdown-menu-item {
    overflow: visible;
  }
}
</style>
