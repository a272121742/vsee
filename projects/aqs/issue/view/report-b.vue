<template>
  <div class="b">
    <a-card :title="`B: `+ $t('title.reporttitlB')">
      <!-- 单车 -->
      <table
        v-if="asqIssueRptType ==='1'"
      >
        <!-- vin -->
        <tr>
          <td>1. {{ $t('issue.vin') }}:</td>
          <td>{{ asqVchListSingle['vin'] }}</td>
        </tr>
        <!-- 城市 -->
        <tr>
          <td>2. {{ $t('issue.dealerCityId') }}:</td>
          <td>{{ asqVchListSingle['areaNameZh'] }}</td>
        </tr>
        <!-- 环境 -->
        <tr>
          <td>3. {{ $t('issue.env') }}</td>
          <td>{{ asqVchListSingle['env'] }}</td>
        </tr>
        <!-- 里程 -->
        <tr>
          <td>4. {{ $t('issue.latestMileage') }}:</td>
          <td>{{ asqVchListSingle['latestMileage'] }}</td>
        </tr>
        <!-- 电池包 -->
        <tr>
          <td>5. {{ $t('issue.batteryName') }}:</td>
          <td>{{ asqVchListSingle['batteryCode'] }}</td>
        </tr>
        <!-- 下线工厂 -->
        <tr>
          <td>6. {{ $t('issue.factoryName') }}:</td>
          <td>{{ asqVchListSingle['factoryName'] }}</td>
        </tr>
        <!-- 生产日期 -->
        <tr>
          <td>7. {{ $t('issue.prodDate') }}:</td>
          <td>{{ asqVchListSingle['prodDate'] }}</td>
        </tr>
        <!-- 销售日期 -->
        <tr>
          <td>8. {{ $t('issue.salesDate') }}:</td>
          <td>{{ asqVchListSingle['salesDate'] }}</td>
        </tr>
        <!-- 车辆用途 -->
        <tr>
          <td>9. {{ $t('issue.carUsageCode') }}:</td>
          <td>{{ asqVchListSingle['carUsageName'] }}</td>
        </tr>
        <!-- 服务站 -->
        <tr>
          <td>10. {{ $t('issue.serviceStationId') }}:</td>
          <td>{{ asqVchListSingle['serviceStationName'] }}</td>
        </tr>
        <!-- 数据信息 -->
        <tr>
          <td>11. {{ $t('issue.envhclInfov') }}:</td>
          <td>{{ asqVchListSingle['vhclInfo'] }}</td>
        </tr>
      </table>
      <!-- 手工+批量 -->
      <table
        v-else-if="asqIssueRptType ==='2'&& isHandmade==='1'"
      >
        <!-- vin -->
        <tr>
          <td>1. {{ $t('issue.vin') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 城市 -->
        <tr>
          <td>2. {{ $t('issue.dealerCityId') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 环境 -->
        <tr>
          <td>3. {{ $t('issue.env') }}</td>
          <td>{{ asqVchListSingle['env'] }}</td>
        </tr>
        <!-- 里程 -->
        <tr>
          <td>4. {{ $t('issue.latestMileage') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 电池包 -->
        <tr>
          <td>5. {{ $t('issue.batteryName') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 下线工厂 -->
        <tr>
          <td>6. {{ $t('issue.factoryName') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 电机号 -->
        <tr>
          <td>7. {{ $t('issue.eleMotorCode') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 生产日期 -->
        <tr>
          <td>8. {{ $t('issue.prodDate') }}:</td>
          <router-link
            :to="{
              path:'/vehicle',
              query:{vin:vin}
            }"
          >
            <a href="">
              见车辆明细
            </a>
          </router-link>
        </tr>
        <!-- 销售日期 -->
        <tr>
          <td>9. {{ $t('issue.salesDate') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 车辆用途 -->
        <tr>
          <td>10. {{ $t('issue.carUsageCode') }}:</td>
          <router-link
            :to="{
              path:'/vehicle',
              query:{vin:vin}
            }"
          >
            <a href="">
              见车辆明细
            </a>
          </router-link>
        </tr>
        <!-- 服务站 -->
        <tr>
          <td>11. {{ $t('issue.serviceStationId') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/vehicle',
                query:{vin:vin}
              }"
            >
              <a href="">
                见车辆明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 数据信息 -->
        <tr>
          <td>12. {{ $t('issue.envhclInfov') }}:</td>
          <td>{{ asqVchListSingle['vhclInfo'] }}</td>
        </tr>
      </table>

      <!-- 工单+批量 -->
      <table
        v-else-if="asqIssueRptType ==='2'&& isHandmade==='0'"
      >
        <!-- vin -->
        <tr>
          <td>1. {{ $t('issue.vin') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 城市 -->
        <tr>
          <td>2. {{ $t('issue.dealerCityId') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 环境 -->
        <tr>
          <td>3. {{ $t('issue.env') }}</td>
          <td>{{ asqVchListSingle['env'] }}</td>
        </tr>
        <!-- 里程 -->
        <tr>
          <td>4. {{ $t('issue.latestMileage') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 电池包 -->
        <tr>
          <td>5. {{ $t('issue.batteryName') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 下线工厂 -->
        <tr>
          <td>6. {{ $t('issue.factoryName') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 电机号 -->
        <tr>
          <td>7. {{ $t('issue.eleMotorCode') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 生产日期 -->
        <tr>
          <td>8. {{ $t('issue.prodDate') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 销售日期 -->
        <tr>
          <td>9. {{ $t('issue.salesDate') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 车辆用途 -->
        <tr>
          <td>10. {{ $t('issue.carUsageCode') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 服务站 -->
        <tr>
          <td>11. {{ $t('issue.serviceStationId') }}:</td>
          <td>
            <router-link
              :to="{
                path:'/order',
                query:{ids:claimNo}
              }"
            >
              <a href="">
                见工单明细
              </a>
            </router-link>
          </td>
        </tr>
        <!-- 数据信息 -->
        <tr>
          <td>12. {{ $t('issue.envhclInfov') }}:</td>
          <td>{{ asqVchListSingle['vhclInfo'] }}</td>
        </tr>
      </table>
    </a-card>
  </div>
</template>

<script>

export default {
  name: 'ReportB',
  props: {
    id: {
      type: String,
      default: '',
    },
    asqVchListSingle: {
      type: Object,
      default: () => ({}),
    },
    vin: {
      type: Array,
      default: () => ([]),
    },
    claimNo: {
      type: Array,
      default: () => ([]),
    },
    asqIssueRptType: {
      type: String,
      default: '',
    },
    isHandmade: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
    };
  },

};
</script>
<style lang="less" scoped>
.ant-card {
  /deep/ .ant-card-head {
    min-height: 42px;
    background-color: rgba(0, 0, 0, 0.09);
    .ant-card-head-title {
      padding: 8px 0;
    }
  }
  table {
    width: calc(100% - 24px);
    margin: 0 12px;
    tr {
      width: 100%;
      line-height: 28px;
      display: flex;
      td:first-child {
        // flex: 1;
        text-align: right;
      }
      td:last-child {
        flex: 5;
        margin-left: 12px;
        color: rgba(0, 0, 0, 0.85);
      }

    }
  }
}
</style>
