<template>
  <a-form
    :form="claimOrderForm"
    class="col-layout-form col-layout-search-form"
    layout="vertical"
    self-update
  >
    <a-row :gutter="24">
      <!-- 索赔类型 -->
      <!-- <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.claimOrderType')">
          <multiple-net-select
            v-decorator="['claimOrderType']"
            :placeholder="$t('form.select')"
            url=""
            value-by="claimOrderType"
            :label-of="(item) => item.claimOrderType"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col> -->
      <!-- 索赔单号 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.claimNo')">
          <a-input
            v-decorator="['claimNo']"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
          <!-- <single-net-select
            v-decorator="['claimNo']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/codeAndClaimNo"
            value-by="claimNo"
            :label-of="(item) => item.claimNo"
            allow-clear
            search-by="name"
          /> -->
        </a-form-item>
      </a-col>
      <!-- vin -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.vin')">
          <a-input
            v-decorator="['vin']"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <!-- 车牌号 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.licenseNo')">
          <a-input
            v-decorator="['licenseNo']"
            :placeholder="$t('form.input')"
            autocomplete="off"
            allow-clear
          />
          <!-- <multiple-net-select
            v-decorator="['licenseNo']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/vehicle/licenseNoList"
            value-by="licenseNo"
            :label-of="(item) => item.licenseNo"
            search-by="name"
            allow-clear
            :max-tag-count="1"
          /> -->
        </a-form-item>
      </a-col>
      <!-- 服务站 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.serviceStationId')">
          <multiple-net-select
            v-decorator="['serviceStationId']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/servicestation/stationList"
            value-by="id"
            :label-of="(item) => item.serviceStationShortName+'-'+item.serviceStationCode"
            search-by="all"
            allow-clear
            :max-tag-count="0"
          />
        </a-form-item>
      </a-col>
      <!-- 故障里程 -->
      <a-col :span="formItemSpan">
        <a-form-item
          style="margin-bottom: 0;padding-bottom:0"
          :label="$t('order.faultMileageForm')"
        >
          <a-input-group compact>
            <a-form-item style="width: 42%;">
              <a-input-number
                v-decorator="['faultMileageStart']"
                style="width: 100%;border-radius: 4px 0 0 4px; text-align: center"
                placeholder="≥(km)"
                class="inputNumber"
                :min="0"
              />
            </a-form-item>
            <a-input
              style=" width: 16%; border-left: 0;border-radius:0; pointer-events: none; backgroundColor: #fff"
              placeholder="~"
              disabled
            />
            <a-form-item style="width: 42%;">
              <a-input-number
                v-decorator="['faultMileageEnd']"
                style="width: 100%; text-align: center;border-left: 0;border-radius: 0 4px 4px 0;"
                placeholder="≤(km)"
                :min="0"
              />
            </a-form-item>
          </a-input-group>
        </a-form-item>
      </a-col>
      <!-- 车型代码 -->
      <a-col :span="formItemSpan">
        <a-form-item
          :label="$t('order.vhclModelSaleCode')"
        >
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
      <!-- 祸首件代码 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.code')">
          <a-auto-complete
            v-decorator="['partCode']"
            :data-source="partCodeSource"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            @search="partCodeSearch"
          >
          </a-auto-complete>
        </a-form-item>
      </a-col>
      <!-- 祸首件名称 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.name')">
          <a-auto-complete
            v-decorator="['partName']"
            :data-source="partNameSource"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            @search="partNameSearch"
          >
          </a-auto-complete>
        </a-form-item>
      </a-col>
      <!-- 供应商代码 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.supplierCode')">
          <a-auto-complete
            v-decorator="['supplierCode']"
            :data-source="supplierCodeSource"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            @search="supplierCodeSearch"
          >
          </a-auto-complete>
        </a-form-item>
      </a-col>
      <!-- 供应商名称 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.supplierName')">
          <a-auto-complete
            v-decorator="['supplierName']"
            :data-source="supplierNameSource"
            :placeholder="$t('form.input')"
            allow-clear
            :get-popup-container="el => el.parentNode"
            dropdown-match-select-width
            @search="supplierNameSearch"
          >
          </a-auto-complete>
        </a-form-item>
      </a-col>
      <!-- 暂留 -->
      <!-- <a-col :span="formItemSpan">
        <a-form-item :label="$t('issue.supplierCode')">
          <multiple-net-select
            v-decorator="['supplierId']"
            :placeholder="$t('form.select')"
            url="/masterdata/v1/supplier/supplierList"
            value-by="id"
            :label-of="(item) => item.supplierName === null ? item.supplierCode : item.supplierName+ '-' + item.supplierCode"
            allow-clear
            search-by="all"
            :max-tag-count="0"
          />
        </a-form-item>
      </a-col> -->
      <!-- 单据状态 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.claimOrderStatus')">
          <multiple-net-select
            v-decorator="['claimOrderStatus']"
            :placeholder="$t('form.select')"
            url="/sys/dict?dictType=claim_order_status"
            value-by="dictValue"
            :label-of="(item) => item.dictName"
            allow-clear
            search-by="name"
            :max-tag-count="1"
          />
        </a-form-item>
      </a-col>
      <!-- 故障代码 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.faultCode')">
          <single-net-select
            v-decorator="['faultSignCode']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultCode"
            value-by="faultSignCode"
            :label-of="(item) => item.faultSignCode"
            allow-clear
            search-by="code"
          />
        </a-form-item>
      </a-col>
      <!-- 故障现象 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.faultSignAnalysis')">
          <single-net-select
            v-decorator="['faultSignAnalysis']"
            :placeholder="$t('form.select')"
            url="/field-q/v1/claimorder/faultReason"
            value-by="faultSignAnalysis"
            :label-of="(item) => item.faultSignAnalysis"
            allow-clear
            search-by="name"
            @change="onFaultSignAnalysisChange"
          />
        </a-form-item>
      </a-col>
      <!-- 生产日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.prodDate')">
          <a-range-picker
            v-decorator="[
              'prodDate'
            ]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 销售日期日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.salesDate')">
          <a-range-picker
            v-decorator="[
              'warrantyBeginDate'
            ]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <!-- 维修日期 -->
      <a-col :span="formItemSpan">
        <a-form-item :label="$t('order.repairDate')">
          <a-range-picker
            v-decorator="[
              'repairDate'
            ]"
            :format="GLOBAL_SELECT_DATE_FORMAT"
          />
        </a-form-item>
      </a-col>
      <div class="col-layout-form-actions">
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
      </div>
    </a-row>
  </a-form>
</template>

<script>
import { uniq, omit } from 'ramda';
import storeModuleMix from '@mix/store-module.js';
import formRecordMix from '@mix/form-record.js';
import timeFormatMix from '@mix/time-format.js';


const omitSearchFields = omit(['prodDate', 'repairDate', 'warrantyBeginDate']);


const fileds = ['claimNo', 'vin', 'partName', 'partCode', 'faultSignCode', 'faultSignAnalysis', 'prodDate', 'repairDate', 'faultMileageStart', 'faultMileageEnd', 'warrantyBeginDate', 'supplierCode', 'supplierName', 'serviceStationId', 'licenseNo', 'vhclSeriesCode', 'claimOrderStatus'];
export default {
  name: 'Order',
  path: '/order',
  components: {
    SingleNetSelect: () => import('@comp/form/SingleNetSelect.vue'),
    MultipleNetSelect: () => import('@comp/form/MultipleNetSelect.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'order',
      action: ['getOrderExportData', 'getPartCodeData', 'getPartNameData', 'getSupplierCodeData', 'getSupplierNameData'],
    }),
    formRecordMix('claimOrderForm', fileds),
    timeFormatMix,
  ],
  data () {
    return {
      formItemSpan: 6,
      partCodeSource: [],
      partNameSource: [],
      supplierCodeSource: [],
      supplierNameSource: [],
    };
  },
  created () {
    this.partCodeSearch();
    this.partNameSearch();
    this.supplierCodeSearch();
    this.supplierNameSearch();
  },

  methods: {
    /**
     * 查询
     */
    orderSearch () {
      this.transformMomentDate(this.claimOrderFormRecord, 'prodDate');
      this.transformMomentDate(this.claimOrderFormRecord, 'repairDate');
      this.transformMomentDate(this.claimOrderFormRecord, 'warrantyBeginDate');
      const claimOrderFormSearch = omitSearchFields({ ...this.claimOrderFormRecord });
      this.$store.commit('order/set', { claimOrderFormSearch });
    },
    /**
     * 重置
     */
    orderReset () {
      this.claimOrderForm.reset();
      this.$store.commit('order/set', { claimOrderFormSearch: {} });
    },
    /**
     * 导出数据
     */
    orderExport () {
      this.getOrderExportData(this.claimOrderFormRecord).then();
    },
    onFaultSignAnalysisChange (value, label) {
      this.claimOrderFormRecord.faultSignAnalysis = label;
    },

    /**
     * 祸首件与供应商 自动加载搜索
     */
    partCodeSearch (value) {
      this.getPartCodeData({ code: value }).then((res) => {
        this.partCodeSource = uniq(res.map((item) => item.code));
      });
    },
    partNameSearch (value) {
      this.getPartNameData({ name: value }).then((res) => {
        this.partNameSource = uniq(res.map((item) => item.name));
      });
    },
    supplierCodeSearch (value) {
      this.getSupplierCodeData({ code: value }).then((res) => {
        this.supplierCodeSource = uniq(res.map((item) => item.supplierCode));
      });
    },
    supplierNameSearch (value) {
      this.getSupplierNameData({ name: value }).then((res) => {
        this.supplierNameSource = uniq(res.map((item) => item.supplierNameZh));
      });
    },
  },
};
</script>
<style lang="less" scoped>
 /deep/  .ant-select-dropdown-menu-root{
      overflow:visible ;
 .ant-select-dropdown-menu-item{
      overflow:visible ;
  }
  .inputNumber{
    width: 100%;
  }
}
/deep/ .ant-select-auto-complete.ant-select .ant-select-search--inline {
    position: absolute;
}
</style>;
