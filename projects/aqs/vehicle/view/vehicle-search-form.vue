<template>
  <a-form-model
    :model="vehicleForm"
    class="vechicle-search-form form-column-split-compact form-column-action-right"
    layout="vertical"
  >
    <a-row :gutter="24">
      <!-- 车型 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('issue.vhclSeriesCode')">
          <multiple-net-select
            v-model="vehicleForm.vhclSeriesCode"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicleseries/seriesCodeList"
            value-by="id"
            label-of="vhclSeriesCode"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-model-item>
      </a-col>
      <!-- 车型代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.vhclModelCode')">
          <single-net-select
            v-model="vehicleForm.vhclModelCode"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelCode"
            allow-clear
            search-by="code"
          />
        </a-form-model-item>
      </a-col>
      <!-- 车型名称 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.vhclModelName')">
          <single-net-select
            v-model="vehicleForm.vhclModelName"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/modelAndCode"
            value-by="vhclModelName"
            allow-clear
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- 下线工厂 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.factoryName')">
          <single-net-select
            v-model="vehicleForm.factoryName"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=factory_code"
            value-by="dictName"
            allow-clear
            close-search
          />
        </a-form-model-item>
      </a-col>
      <!-- 颜色名称 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.colorName')">
          <single-net-select
            v-model="vehicleForm.colorName"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/colorNameAndCode"
            value-by="colorName"
            allow-clear
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- vin -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.vin')">
          <a-input
            v-model="vehicleForm.vin"
            placeholder="请输入"
            autocomplete="off"
            allow-clear
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- 出厂日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.prodDate')">
          <a-range-picker
            v-model="vehicleForm.prodDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <!-- 省份名称 -->
      <!-- <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.areaCode')">
          <single-net-select
            v-model="vehicleForm.provinceCode"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/area/province"
            value-by="areaCode"
            :label-of="(item) => item.areaNameZh"
            allow-clear
            close-search
          />
        </a-form-model-item>
      </a-col> -->
      <!-- 质保起始日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('vehicle.salesDate')">
          <a-range-picker
            v-model="vehicleForm.warrantyBeginDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>

      <!-- 查询 + 重置 -->
      <a-col
        class="form-column-action"
        :span="formItemSpan"
      >
        <a-button
          type="primary"
          @click="vehicleSearch"
        >
          {{ $t('action.find') }}
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="vehicleReset"
        >
          {{ $t('action.reset') }}
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="vehicleExport"
        >
          {{ $t('action.export') }}
        </a-button>
      </a-col>
    </a-row>
  </a-form-model>
</template>

<script>
import { omit } from 'ramda';
import storeModuleMix from '@mix/store-module.js';
import { RANGE_TO_MAP_BY_FIELD } from '@util/datetime-helper.js';

const omitSearchFields = omit(['prodDate', 'warrantyBeginDate']);


export default {
  mixins: [
    storeModuleMix({
      name: 'vehicle',
      action: ['getVehicleExportData'],
    }),
  ],
  data () {
    return {
      formItemSpan: 6,
      vehicleForm: {
      },
    };
  },
  methods: {
    vehicleSearch () {
      RANGE_TO_MAP_BY_FIELD(this.vehicleForm, 'prodDate');
      RANGE_TO_MAP_BY_FIELD(this.vehicleForm, 'warrantyBeginDate');
      const vehicleSearchList = omitSearchFields({ ...this.vehicleForm });
      this.$store.commit('vehicle/set', { vehicleSearchList });
    },
    /**
     * 重置
     */
    vehicleReset () {
      this.$set(this, 'vehicleForm', {});
      this.$store.commit('vehicle/set', { vehicleSearchList: {} });
    },
    /**
     * 导出
     */
    vehicleExport () {
      this.getVehicleExportData(this.vehicleForm).then();
    },
  },
};
</script>
<style lang="less" scoped>
  .vechicle-search-form {
    min-height: 173px;
    /deep/ .ant-select-dropdown-menu-root {
      overflow: visible;
      /deep/ .ant-select-dropdown-menu-item {
        overflow: visible;
      }
    }
  }
</style>
