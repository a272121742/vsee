<template>
  <div class="vehicledetail">
    <a-row
      type="flex"
      class="form box mgb-0 mgt-0"
    >
      <a-col :span="6">
        <h2 style="font-size:26px;">
          {{ infoData.vin }}
        </h2>
      </a-col>
      <a-col
        :span="18"
        class="info"
      >
        <a-row>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Model') }}:</span>
            <span class="spanVal">{{ infoData.vhcl_model_name }}</span>
          </a-col>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Model Year') }}:</span>
          </a-col>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Color') }}:</span>
            <span class="spanVal">{{ infoData.color_name }}</span>
          </a-col>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Plant') }}:</span>
            <span class="spanVal">{{ infoData.plant_shot_nm }}</span>
          </a-col>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Production date') }}:</span>
            <span class="spanVal">{{ infoData.prod_date }}</span>
          </a-col>
          <a-col :span="8">
            <span>{{ $t('vehicledetail.Sale date') }}:</span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <div class="box">
      <a-tabs default-active-key="1">
        <!-- Vehicle Info. -->
        <a-tab-pane
          key="1"
          tab="Vehicle Info."
        >
          <vehicle-info />
        </a-tab-pane>
        <!-- Parts -->
        <a-tab-pane
          key="2"
          tab="Parts"
          class="Parts"
        >
          <!-- Unique Part 精确追溯件 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openParts('Unique')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Unique Part 精确追溯件
              </span>
            </a-col>
            <a-col v-show="Unique">
              <traceable-part :href="href" />
            </a-col>
          </a-row>
          <!-- Batch Part 批次追溯件 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openParts('Batch')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Batch Part 批次追溯件
              </span>
            </a-col>
            <a-col v-show="Batch">
              <batch-part-trace :href="href" />
            </a-col>
          </a-row>
        </a-tab-pane>
        <!-- Production -->
        <a-tab-pane
          key="3"
          tab="Production"
          force-render
          class="Production"
        >
          <!-- Checkpint 过点信息 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('Checkpint')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Checkpint 过点信息
              </span>
            </a-col>
            <a-col v-show="show.Checkpint">
              <Checkpoint :href="href" />
            </a-col>
          </a-row>
          <!-- Online Defect 过程缺陷 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('OnlineDefect')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Online Defect 过程缺陷
              </span>
            </a-col>
            <a-col v-show="show.OnlineDefect">
              <online-defect :href="href" />
            </a-col>
          </a-row>
          <!-- Filling 加注 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('Filling')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Filling 加注
              </span>
            </a-col>
            <a-col v-show="show.Filling">
              <filling :href="href" />
            </a-col>
          </a-row>
          <!-- Torque 扭矩 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('Torque')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Torque 扭矩
              </span>
            </a-col>
            <a-col v-show="show.Torque">
              <torque :href="href" />
            </a-col>
          </a-row>
          <!-- Certificate 合格证 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('Certificate')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                Certificate 合格证
              </span>
            </a-col>
            <a-col v-show="show.Certificate">
              <Certificate :href="href" />
            </a-col>
          </a-row>
          <!-- EOL Test 检测线 -->
          <a-row>
            <a-col class="clickTitle">
              <span @click="openProduction('EOLTest')">
                <a-icon
                  type="right"
                  fill="#0097E0"
                />
                EOL Test 检测线
              </span>
            </a-col>
            <a-col v-show="show.EOLTest">
              <EOLTest :href="href" />
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
import $ from '@http';
import api from '../api.js';

export default {
  components: {
    VehicleInfo: () => import('../view/vehicle-info.vue'),
    // Parts
    TraceablePart: () => import('./traceable-part.vue'),
    BatchPartTrace: () => import('./batch-part-trace.vue'),
    // Production
    Checkpoint: () => import('./checkpoint.vue'),
    onlineDefect: () => import('./online-defect.vue'),
    Filling: () => import('./filling.vue'),
    Torque: () => import('./torque.vue'),
    Certificate: () => import('./certificate.vue'),
    EOLTest: () => import('./eol-test.vue'),
  },
  mixins: [api],
  data () {
    return {
      tableData: [],
      loading: false,
      show: {
        Checkpint: true,
        OnlineDefect: false,
        Filling: false,
        Torque: false,
        Certificate: false,
        EOLTest: false,
      },
      Unique: true,
      Batch: false,
      href: true,
      infoData: {},
    };
  },
  created () {
    if (this.$route.query.vin) {
      this.$store.commit('setConfig', { menu_type: false });
      this.$store.commit('setConfig', { content_head: false });
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
    }
  },
  methods: {
    openProduction (type) {
      this.show = {
        Checkpint: false,
        OnlineDefect: false,
        Filling: false,
        Torque: false,
        Certificate: false,
        EOLTest: false,
      };
      this.show[type] = true;
    },
    openParts (type) {
      this.Unique = false;
      this.Batch = false;
      this[type] = true;
    },
  },
};
</script>
<style lang="less" scoped>
.vehicledetail {
  /deep/ .ant-tabs {
    height: auto !important;
  }
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 88px);
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
  ul {
    padding-left: 8px;
    li {
      position: relative;
      color: rgba(0, 0, 0, 0.45);
      text-align: center;
      display: inline-block;
      border-right: 1px solid rgba(0, 0, 0, 0.16);
      margin-top: 16px;
      margin-left: 16px;
      line-height: 12px;

      &:last-child {
        border-right: none;
      }

      span:first-child {
        text-align: left;
      }
      span:nth-child(2) {
        padding-left: 8px;
        padding-right: 16px;
        color: rgba(0, 0, 0, 0.85);
      }
      .anticon {
        position: absolute;
        top: -10px;
        right: 4px;
        width: 14px;
        color: rgba(0, 0, 0, 0.16);
      }
    }
  }
  .anticon-right {
    color: #0097e0;
  }
  .Production,
  .Parts {
    span {
      cursor: pointer;
      font-weight: 700;
    }
    .clickTitle {
      padding: 10px 0;
    }
  }
  .info {
    height: 80px;
    font-size: 16px;
    .spanVal {
      margin-left: 8px;
      font-weight: 700;
    }
  }
}
</style>
