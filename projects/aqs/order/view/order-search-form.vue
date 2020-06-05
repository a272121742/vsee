<template>
  <a-form-model
    :model="claimOrderForm"
    class="order-search-form form-column-split-compact form-column-action-right"
    layout="vertical"
  >
    <a-row :gutter="24">
      <!-- 索赔类型 -->
      <!-- <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.claimOrderType')">
          <multiple-net-select
            v-model="claimOrderForm.claimOrderType']"
            :placeholder="$t('form.select')"
            url=""
            value-by="claimOrderType"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-model-item>
      </a-col> -->
      <!-- 索赔单号 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.claimNo')">
          <a-input
            v-model="claimOrderForm.claimNo"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
          <!-- <single-net-select
            v-model="claimOrderForm.claimNo']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/codeAndClaimNo"
            value-by="claimNo"
            allow-clear
            search-by="name"
          /> -->
        </a-form-model-item>
      </a-col>
      <!-- vin -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.vin')">
          <a-input
            v-model="claimOrderForm.vin"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- 车牌号 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.licenseNo')">
          <a-input
            v-model="claimOrderForm.licenseNo"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
          <!-- <multiple-net-select
            v-model="claimOrderForm.licenseNo']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/licenseNoList"
            value-by="licenseNo"
            search-by="name"
            allow-clear
            :max-tag-count="1"
          /> -->
        </a-form-model-item>
      </a-col>
      <!-- 服务站 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.serviceStationId')">
          <multiple-net-select
            v-model="claimOrderForm.serviceStationId"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/servicestation/stationList"
            value-by="id"
            :label-of="(item) => `${item.serviceStationShortName}-${item.serviceStationCode}`"
            search-by="all"
            allow-clear
            :max-tag-count="0"
          />
        </a-form-model-item>
      </a-col>
      <!-- 故障里程 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          style="margin-bottom: 0; padding-bottom: 0;"
          :label="$t('order.faultMileageForm')"
        >
          <a-input-group compact>
            <a-form-model-item style="width: 42%;">
              <a-input-number
                v-model="claimOrderForm.faultMileageStart"
                style="width: 100%;border-radius: 4px 0 0 4px; text-align: center"
                placeholder="≥(km)"
                class="inputNumber"
                :min="0"
              />
            </a-form-model-item>
            <a-input
              style=" width: 16%; border-left: 0;border-radius:0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-form-model-item style="width: 42%;">
              <a-input-number
                v-model="claimOrderForm.faultMileageEnd"
                style="width: 100%; text-align: center;border-left: 0;border-radius: 0 4px 4px 0;"
                placeholder="≤(km)"
                :min="0"
              />
            </a-form-model-item>
          </a-input-group>
        </a-form-model-item>
      </a-col>
      <!-- 车型代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item
          :label="$t('order.vhclModelSaleCode')"
        >
          <multiple-net-select
            v-model="claimOrderForm.vhclSeriesCode"
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
      <!-- 祸首件代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.code')">
          <net-auto-complete
            v-model="claimOrderForm.partCode"
            url="/masterdata/v1/part/partList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="code"
            search-by="code"
          />
        </a-form-model-item>
      </a-col>
      <!-- 祸首件名称 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.name')">
          <net-auto-complete
            v-model="claimOrderForm.partName"
            url="/masterdata/v1/part/partNameList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="name"
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- 供应商代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.supplierCode')">
          <net-auto-complete
            v-model="claimOrderForm.supplierCode"
            url="/masterdata/v1/supplier/supplierList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="supplierCode"
            search-by="code"
          />
        </a-form-model-item>
      </a-col>
      <!-- 供应商名称 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.supplierName')">
          <net-auto-complete
            v-model="claimOrderForm.supplierCode"
            url="/masterdata/v1/supplier/supplierNameList"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            value-by="supplierNameZh"
            search-by="name"
          />
        </a-form-model-item>
      </a-col>
      <!-- 暂留 -->
      <!-- <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('issue.supplierCode')">
          <multiple-net-select
            v-model="claimOrderForm.supplierId"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/supplier/supplierList"
            value-by="id"
            :label-of="(item) => item.supplierName === null ? item.supplierCode : item.supplierName+ '-' + item.supplierCode"
            allow-clear
            search-by="all"
            :max-tag-count="0"
          />
        </a-form-model-item>
      </a-col> -->
      <!-- 单据状态 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.claimOrderStatus')">
          <!-- @FIXME: 这里的地址不应该放参数，应该封装在q里 -->
          <multiple-net-select
            v-model="claimOrderForm.claimOrderStatus"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=claim_order_status"
            value-by="dictValue"
            label-of="dictName"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-model-item>
      </a-col>
      <!-- 故障代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.faultCode')">
          <single-net-select
            v-model="claimOrderForm.faultSignCode"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultCode"
            value-by="faultSignCode"
            allow-clear
            search-by="code"
          />
        </a-form-model-item>
      </a-col>
      <!-- 故障现象 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.faultSignAnalysis')">
          <single-net-select
            v-model="claimOrderForm.faultSignAnalysis"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultReason"
            value-by="faultSignAnalysis"
            allow-clear
            search-by="name"
            @change="onFaultSignAnalysisChange"
          />
        </a-form-model-item>
      </a-col>
      <!-- 生产日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.prodDate')">
          <a-range-picker
            v-model="claimOrderForm.prodDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <!-- 销售日期日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.salesDate')">
          <a-range-picker
            v-model="claimOrderForm.warrantyBeginDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <!-- 维修日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item :label="$t('order.repairDate')">
          <a-range-picker
            v-model="claimOrderForm.repairDate"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <a-col
        class="form-column-action"
        :span="formItemSpan"
      >
        <a-button
          type="primary"
          @click="orderSearch"
        >
          {{ $t('action.find') }}
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="orderReset"
        >
          {{ $t('action.reset') }}
        </a-button>
        <a-button
          :style="{ marginLeft: '8px' }"
          @click="orderExport"
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

const omitSearchFields = omit(['prodDate', 'repairDate', 'warrantyBeginDate']);

export default {
  mixins: [
    storeModuleMix({
      name: 'order',
      action: ['getOrderExportData', 'getPartCodeData', 'getPartNameData', 'getSupplierCodeData', 'getSupplierNameData'],
    }),
  ],
  data () {
    return {
      formItemSpan: 6,
      claimOrderForm: {},
    };
  },
  methods: {
    /**
     * 查询
     */
    orderSearch () {
      RANGE_TO_MAP_BY_FIELD(this.claimOrderForm, 'prodDate');
      RANGE_TO_MAP_BY_FIELD(this.claimOrderForm, 'repairDate');
      RANGE_TO_MAP_BY_FIELD(this.claimOrderForm, 'warrantyBeginDate');
      const claimOrderFormSearch = omitSearchFields({ ...this.claimOrderForm });
      this.$store.commit('order/set', { claimOrderFormSearch });
    },
    /**
     * 重置
     */
    orderReset () {
      this.$set(this, 'claimOrderForm', {});
      this.$store.commit('order/set', { claimOrderFormSearch: {} });
    },
    /**
     * 导出数据
     */
    orderExport () {
      this.getOrderExportData(this.claimOrderForm).then();
    },
    onFaultSignAnalysisChange (value, label) {
      this.claimOrderForm.faultSignAnalysis = label;
    },
  },
};
</script>
<style lang="less" scoped>
  .order-search-form {
    min-height: 291px;
    /deep/  .ant-select-dropdown-menu-root{
      overflow:visible ;
      /deep/ .ant-select-dropdown-menu-item{
        overflow:visible ;
      }
    }
  }
</style>;
