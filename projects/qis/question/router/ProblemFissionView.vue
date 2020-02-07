<template>
  <!-- 问题裂变 -->
  <a-modal
    :title="$t('fissionApplication.fissionInfo')"
    :visible="visibleFisson"
    :mask-closable="false"
    class="fission-modal"
    width="720px"
    @ok="FissionOk"
    @cancel="FissionCancel"
  >
    <!-- 子问题一 -->
    <div v-for="(item,index) in fissionList">
      <a-form
        class="ant-advanced-search-form back-form"
      >
        <div class="modalTitle">
          {{ $t('fissionApplication.subquestion['+index+']') }}
        </div>
        <!-- 问题标题 -->
        <a-row>
          <a-col :span="22">
            <a-form-item
              :label="$t('issue.title')"
              self-update
            >
              <span>{{ questionDetail.title }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 问题责任部门 -->
        <a-row>
          <a-col :span="22">
            <a-form-item :label="$t('issue_workflow.D1.resposibleDepartment')">
              <span>{{ fissionList[index].subIssueDepartmentName }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <!-- 责任人 -->
        <a-row>
          <a-col :span="22">
            <a-form-item :label="$t('issue_workflow.D1.champion')">
              <span>{{ fissionList[index].subIssueChampionName }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 裂变理由 -->
            <a-form-item
              :label="$t('fissionApplication.fissionReasons')"
              self-update
            >
              <span>{{ fissionList[index].fissionReason }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="22">
            <!-- 附件 -->
            <a-form-item
              :label="$t('issue_workflow.attachment') "
              style="height:auto;"
            >
              <!-- 问题定义附件 -->
              <div
                v-if="fissionList[index].files && fissionList[index].files"
                class="ant-upload-list ant-upload-list-text"
                style="overflow-y: auto; max-height: 82px;z-index: 10;"
              >
                <div
                  v-for="(file, index) in fissionList[index].files"
                  :key="index"
                  class="ant-upload-list-item ant-upload-list-item-done"
                  style="margin-top: 0; margin-right: 14px;"
                >
                  <div class="ant-upload-list-item-info">
                    <span>
                      <a-icon
                        type="paper-clip"
                        style="top: 3px; left: 0;"
                      />
                      <span
                        :title="file.originalFilename"
                        style="padding-left: 0;"
                        class="ant-upload-list-item-name"
                      >
                        <a
                          :title="file.originalFilename"
                          :href="getDownloadURL(file.path, file.originalFilename)"
                          :download="file.originalFilename"
                          rel="noopener noreferrer"
                          class="ant-upload-list-item-name"
                          style="padding-left: 14px;"
                        >
                          {{ file.originalFilename }}
                        </a>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
  </a-modal>
</template>
<script>
import {
  autoUpdateFileds,
  createFormFields,
} from '@util/formhelper.js';
import {
  createNamespacedHelpers,
} from 'vuex';
import { transform, treeTransform } from '@util/datahelper.js';
import { switchCase } from 'babel-types';
import attachmentMix from '~~/issue-attachment.js';
import { enableScroll } from '~~/scroll.js';

const {
  mapActions,
} = createNamespacedHelpers('question');
export default {
  name: 'ProblemFissionView',
  mixins: [attachmentMix],
  data () {
    return {
      visibleFisson: false, // 裂变弹框是否显示
      fissionList: [], // 问题裂变列表
      questionDetail: {
        title: '',
      },
    };
  },
  methods: {
    ...mapActions([
      'eidtQuestion', // 主问题详情
      'fissionDetail', // 裂变信息
    ]),
    // 初始化
    init (id) {
      this.id = id;
      this.visibleFisson = true;
      // 问题详情
      this.eidtQuestion(id).then((res) => {
        this.questionDetail.title = res.title;
      });
      // 查询裂变信息
      this.fissionDetail(id).then((res) => {
        this.fissionList = res;
      });
    },
    // 确定
    FissionOk () {
      enableScroll();
      this.visibleFisson = false;
    },
    // 取消
    FissionCancel () {
      enableScroll();
      this.visibleFisson = false;
    },
  },
};
</script>
<style lang="less" scoped>
  .ant-advanced-search-form {
    border-radius: 6px;
    margin-bottom: 16px;
    background-color:#fff;
    /deep/ .ant-form-item-control{
        line-height:22px;
    }
    /deep/ .ant-form-item {
      display: flex;
    }

    /deep/ .ant-form-item-label {
      flex: 0.5;
    }

    /deep/ .ant-form-item-control-wrapper {
      flex: 1;
    }

    /deep/ .ant-form {
      max-width: none;
    }
  }
 .back-form{
   /deep/ .ant-form-item {
    margin-bottom: 8px;
   }
   /deep/ .ant-form-item-label {
    line-height:22px;
   }
 }
  .back-form{
      // 统一设置问题流程的字体颜色
      /deep/ .ant-form-item-label label {
        color: rgba(0, 0, 0, 0.45);
      }
      /deep/ .ant-form-item-control-wrapper p {
        color: rgba(0, 0, 0, 0.65);
      }
 }
 .modalTitle{
   font-size: 14px;
   color: rgba(0,0,0,0.85);
 }
 .icon-less{
   margin-left:11.5px;
 }
  .fission-modal{
    top:200px;
    height:847px;
    padding-bottom: 0;
    /deep/ .form-item-label-desc {
    color: rgba(0, 0, 0, .45);
    font-size: 12px;
  }
  }
</style>
