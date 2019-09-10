<template>
  <div>
    <a-form :from="formDetail">
      <div class="Dcontent D0content" >
        <div class="triangle_border_up">
          <span></span>
        </div>
        <a-row>
          <a-col :span="21">
            <a-form-item :label="`是否立项`">
              <a-radio-group :options="satisfy" @change="satisfyChange" v-decorator="[
                        'satisfyRadio',
                         {rules: [{ required: true, message: '请选择是否立项' }]}
                      ]" />
            </a-form-item>
          </a-col>
        </a-row>
        <div v-if="!satisfyFlag">
          <a-row>
            <a-col :span="21">
              <a-form-item :label="`理由`">
                <a-textarea placeholder="请输入" v-decorator="[
                        'dissatisfaction',
                         {rules: [{ required: true, message: '请输入理由' }]}
                      ]"></a-textarea>
              </a-form-item>
            </a-col>
          </a-row>

        </div>

        <div v-if="satisfyFlag">
          <a-row>
            <a-col :span="21">
              <a-form-item :label="`是否需要围堵措施`">

                <a-radio-group :options="contActionOption" @change='conActionChange' v-decorator="[
                        'containmentAction',
                         {rules: [{ required: true, message: '请选择是否立项' }]}
                      ]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="conActionFlag">
            <a-col :span="21">
              <a-form-item :label="`围堵措施`">
                <a-textarea placeholder="请输入" style="width:572px;height:88px;" v-decorator="[
                      'Measures',
                      {rules: [{ required: true, message: '请输入围堵措施' }]}
                    ]"></a-textarea>

              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <a-row>
          <a-col :span="21">
            <a-form-item :label="`附件`">
              <a-upload name="file" :multiple="true"  @change="handleChange">
                <a-button>
                  <a-icon type="upload" /> 上传文件
                </a-button>
              </a-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <!-- <div class="Dcontent D0back">

        <div class="triangle_border_up" style="left:80px;">
          <span></span>
        </div>
        <a-row>
          <a-col :span="21">
            <a-form-item :label="`立项条件`">
              <p>{{ stepDetail.satisfyRadio==='0'?'是':'否' }}</p>
            </a-form-item>
          </a-col>
        </a-row>
        <div v-if="stepDetail.satisfyRadio==='0'">
          <a-row>
            <a-col :span="21">
              <a-form-item :label="`需要围堵措施`">
                <p>{{stepDetail.containmentAction}}</p>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="stepDetail.containmentAction==='0'">
            <a-col :span="21">
              <a-form-item :label="`围堵措施`">
                <p>{{stepDetail.Measures}}</p>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <div v-if="stepDetail.satisfyRadio==='1'">
          <a-row>
            <a-col :span="21">
              <a-form-item :label="`理由`">
                <p>{{ stepDetail.dissatisfaction }}</p>
              </a-form-item>
            </a-col>
          </a-row>
        </div>
        <a-row>
          <a-col :span="21">
            <a-form-item :label="`附件`" style="height:auto;">
              <div class="stepFileList clearfix">
                <ul class="fileList clearfix">
                  <li v-for="(item,index) in stepDetail.fileList" :title="item" :key="index">
                    <img src="/static/question/file.png">
                    <span>{{ item }}</span>
                  </li>

                </ul>
              </div>
            </a-form-item>
          </a-col>
        </a-row>
      </div> -->
    </a-form>
  </div>
</template>
<script>
  import {
    createFormFields,
    autoUpdateFileds
  } from '@util/formhelper.js';
  import {
    createNamespacedHelpers
  } from 'vuex';
  import moment from 'moment';
  const {
    mapActions
  } = createNamespacedHelpers('question');
  export default {
    name: 'D0Content',

    data() {
      return {
        contActionOption: [{
          label: '需要',
          value: '0'
        }, {
          label: '不需要',
          value: '1'
        }],
        stepDetail: null,
        formDetail: null,
        satisfyFlag: true, // 是否满足标识
        conActionFlag: true, //围堵措施是否显示表示
        satisfy: [{
            label: '是',
            value: '0'
          },
          {
            label: '是',
            value: '0'
          }
        ],
         record: {
          //D0
          satisfyRadio: '0', //  是否满足立项条件
          dissatisfaction: '', // 不满足理由
          Remarks: '', // 备注
          containmentAction: '0', //是否需要围堵措施
          Measures: '', //围堵措施
         }

      }
    },

    created() {
        this.formDetail = this.$form.createForm(this, {
        mapPropsToFields: () => createFormFields(this, [
          'satisfyRadio', 'containmentAction', 'Measures', 'dissatisfaction', 'Remarks'
        ], 'record'),
        onValuesChange: autoUpdateFileds(this, 'record')
      });
      this.init();
    },
    methods: {
      ...mapActions([
        // 分页查询全部问题
        'getQuestionStep'
      ]),
      init() {
        this.getQuestionStep(1).then(res => {
          this.stepDetail = res;

        });
      },
       //是否需要围堵措施
      conActionChange(e) {

        if (e.target.value === '0') {
          this.conActionFlag = true;
        } else {
          this.conActionFlag = false;
        }
      },
       handleChange() {},
      // 是否满足立项条件切换
      satisfyChange(e) {

        this.record.containmentAction = '0';
        if (e.target.value === '0') {
          this.satisfyFlag = true;
        } else if (e.target.value === '1') {
          this.satisfyFlag = false;
        }
      },
    }
  }
</script>

<style lang="less" scoped>

  .Dcontent {
    background: rgba(0, 0, 0, 0.02);
    border-radius: 4px;
    border-radius: 4px;
    margin-top: 70px;
    padding-top: 28px;
    position: relative;
    width: 1076px;
    height: auto;

    .backTitle {
      position: relative;
      top: -20px;
      left: 32px;
    }

    .triangle_border_up {
      width: 0;
      height: 0;
      border-width: 0 16px 15px;
      border-style: solid;
      border-color: transparent transparent #fafafa;
      /*透明 透明  灰*/
      position: absolute;
      left: 80px;
      top: -15px;
    }
  }
  .D0back {
    /deep/ .ant-form-item {
      height: 46px;
      line-height: 46px;
      margin-bottom: 0;
      margin-left: 22px;
      margin-right: 22px;
    }

    /deep/.ant-form-item-label {
      height: 46px;
      line-height: 46px;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;

      label {
        color: rgba(0, 0, 0, 0.45);
      }
    }

    p {
      height: 46px;
      line-height: 46px;
      font-family: SourceHanSansCN-Normal;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      letter-spacing: 0;
    }
  }
     .stepFileList {
      .fileList {
        width: 421px;
        overflow: hidden;
        margin-top: 8px;
        margin-left: -20px;

        li {
          float: left;
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.65);
          text-align: left;
          line-height: 22px;
          width: 80px;
          list-style: none;
          margin-left: 10px;
          margin-right: 10px;
          overflow: hidden;
          /*超出的部分隐藏起来。*/
          white-space: nowrap;
          /*不显示的地方用省略号...代替*/
          text-overflow: ellipsis;
          /* 支持 IE */
        }
      }

      .d2file {
        float: left;
        margin-top: -5px;
      }
    }
</style>