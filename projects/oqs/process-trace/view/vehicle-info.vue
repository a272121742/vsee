<template>
  <div class="vehiclepr">
    <a-row
      type="flex"
      justify="space-between"
      style="border-bottom:1px solid #ccc;"
    >
      <a-col style="padding:10px 0;font-weight:700;">
        <span>
          <a-icon
            type="right"
            fill="#0097E0"
          />
          Basic Information 车辆基本信息
        </span>
      </a-col>
    </a-row>
    <a-row type="flex">
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.VIN') }}:</span>
        <span>{{ infoData.vin }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Body No') }}:</span>
        <span>{{ infoData.bsn }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.GA No') }}:</span>
        <span>{{ infoData.ga_no }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Model') }}:</span>
        <span>{{ infoData.vhcl_model_name }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Model Year') }}:</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Plant') }}:</span>
        <span>{{ infoData.plant_shot_nm }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.GA Buyoff Time') }}:</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Handover date') }}:</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.OrderNo') }}:</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Client') }}:</span>
        <span>{{ infoData.cust_name }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Color') }}:</span>
        <span>{{ infoData.color_name }}</span>
      </a-col>
      <a-col
        :span="8"
        style="margin-top:20px;"
      >
        <span style="margin-right:20px;">{{ $t('vehicledetail.Battery SN') }}:</span>
        <span>{{ infoData.battery_code }}</span>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import $ from '@http';

export default {
  components: {
  },
  data () {
    return {
      loading: false,
      infoData: {},
    };
  },
  computed: {
  },
  created () {
    this.requestData(this.traceablePartDialogData);
  },
  methods: {
    requestData () {
      this.loading = true;
      $.get(`/oqs/sqlquery/queryData?code=vehicle_query`, {
        vin: this.$route.query.vin,
        bsn: null, // 车身号 模糊
        ga_no: null, // 总装序列号 模糊
        sales_order_no: null,
        vhcl_model_list: null,
        plant_id_list: null,
        prod_date_start: null,
        prod_date_end: null,
        out_stock_date_start: null,
        out_stock_date_end: null,
        material_code: null,
      }).then((data) => {
        this.infoData = data[0];
      }).finally(() => {
        this.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.vehiclepr {
  display: flex;
  flex-direction: column;
  .anticon-right {
    color: #0097e0;
  }
  .echarts {
    height: 500px;
  }
  /deep/ .ant-table-wrapper {
    margin-top: 10px;
  }
  .ant-table-tbody {
    span {
      display: inline-block;
      width: auto;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  /deep/ td:nth-child(3) {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
  }
}
</style>
