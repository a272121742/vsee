<template>
  <div v-if="id">
    <div class="top">
      <p>{{ $t('title.reporttitl') }}</p>
    </div>
    <div class="head">
      <span class="left">
        {{ $t('issue.asqIssueRptCode') }}:{{ num }}
      </span>
      <a-button
        class="btnDownload"
        type="primary"
        html-type="submit"
        @click="download"
      >
        {{ $t('action.download') }}
      </a-button>
    </div>

    <div class="row"></div>
    <!-- 使用注册的组件 -->
    <report-centre
      :id="id"
      :asq-issue-defn-data="asqIssueDefnData"
    />
    <!-- A B C D E -->
    <div class="ABCDE">
      <div>
        <report-a
          :id="id"
          class="ABCDE-content"
          :asq-issue-defn-data="asqIssueDefnData"
        />
        <report-c
          :id="id"
          class="ABCDE-content"
          :asq-issue-defn-data="asqIssueDefnData"
        />
        <report-e
          :id="id"
          class="ABCDE-content"
          :asq-issue-defn-data="asqIssueDefnData"
        />
      </div>
      <div>
        <report-b
          :id="id"
          class="ABCDE-content"
          :vin="vin"
          :claim-no="claimNo"
          :asq-issue-rpt-type="asqIssueRptType"
          :is-handmade="isHandmade"
          :asq-vch-list-single="asqVchListSingle"
        />
        <report-d
          :id="id"
          class="ABCDE-content"
          :asq-issue-defn-data="asqIssueDefnData"
        />
      </div>
    </div>
    <div
      v-if="asqIssueRptType === '2'&& isHandmade === '0'"
      :id="id"
      class="F"
    >
      <report-f
        class="ABCDE-content"
        :order-about-data="orderAboutData"
      />
    </div>
    <div
      v-if="asqIssueRptType === '3'&& isHandmade === '0'"
      :id="id"
      class="F"
    >
      <report-f
        class="ABCDE-content"
        :order-about-data="orderAboutData"
      />
    </div>
  </div>
</template>

<script>
import storeModuleMix from '@mix/store-module.js';

export default {
  name: 'ReportTop',
  // 注册组件
  components: {
    'report-centre': () => import('~/issue/view/report-centre.vue'),
    'report-a': () => import('~/issue/view/report-a.vue'),
    'report-b': () => import('~/issue/view/report-b.vue'),
    'report-c': () => import('~/issue/view/report-c.vue'),
    'report-d': () => import('~/issue/view/report-d.vue'),
    'report-e': () => import('~/issue/view/report-e.vue'),
    'report-f': () => import('~/issue/view/report-f.vue'),
  },
  mixins: [
    storeModuleMix({
      name: 'issue',
      action: ['getAsqissuedefn', 'getBatchDownloadData', 'getSingleDownloadData'],
    }),
  ],
  props: {
    id: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      num: '',
      asqIssueRptType: '',
      isHandmade: '',
      asqIssueDefnData: {},
      asqVchListSingle: {},
      vin: [],
      claimNo: [],
      orderAboutData: {},
      downId: '',
    };
  },
  created () {
    if (this.id) {
      this.fetch();
    } else {
      this.$router.push({ path: '/issue/definition-list' });
    }
  },
  methods: {
    /*
    * 将从问题定义页面拿到的id发送给后台，并将后台返回的数据进行分发
    */
    fetch () {
      this.getAsqissuedefn(this.id).then((res) => {
        this.asqIssueDefnData = res.asqIssueDefnData;
        this.num = res.asqIssueDefnData.asqIssueRptCode;
        this.asqIssueRptType = res.asqIssueDefnData.asqIssueRptType;
        this.isHandmade = res.asqIssueDefnData.isHandmade;
        if (res.asqIssueDefnData.asqVchList.length > 0) {
          // 用来提取单车的字段的
          this.asqVchListSingle = res.asqIssueDefnData.asqVchList[0];
        }
        this.vin = res.asqIssueDefnData.asqVchList.map((item) => item.vin);
        this.claimNo = res.asqIssueDefnData.asqVchList.map((item) => item.claimNo);
        this.orderAboutData = res.orderAboutData;
        // 下载
        this.downId = res.asqIssueDefnData.id;
      });
    },
    /*
    * 下载按钮,根据单车和批量进行判断
    */
    download () {
      if (this.asqIssueRptType === '1') {
        this.getSingleDownloadData({ id: this.downId });
      } else {
        this.getBatchDownloadData({ id: this.downId });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.top{
  font-family: SourceHanSansCN-Medium;
  font-size: 20px;
  color: rgba(0,0,0,0.85);
  display: flex;
  justify-content: space-between;

  p{
    margin: 4px auto;
  }
}
.head{
  margin: 4px 0 20px;
.btnDownload{
  float: right;
}
}

.row{
  border-bottom: solid 1px rgba(0,0,0,0.09);
}
.ABCDE{
  padding-top: 2.5%;
  display: flex;
  justify-content: space-between;
  >div{
    width: 49.5%;
  }
}
</style>
