export default `<template>
  <div>
    <a-page-header
      title="表单绑值"
      sub-title="使用内置form-record插件自动绑值"
    >
      <template slot="extra">
        <a-modal
          v-model="showSource"
          centered
          width="80%"
        >
          <SourceCodeView :code="code"></SourceCodeView>
        </a-modal>
        <a-button-group>
          <a-button @click="() => showSource = !showSource">
            源码
          </a-button>
          <a-button
            :disabled="action"
            @click="commit"
          >
            提交
          </a-button>
          <a-button
            :disabled="action"
            @click="load"
          >
            加载
          </a-button>
          <a-button
            :disabled="action"
            @click="reset"
          >
            重置
          </a-button>
          <a-button
            :disabled="action"
            @click="clear"
          >
            清空
          </a-button>
          <a-button
            :disabled="action"
            @click="cache"
          >
            缓存
          </a-button>
        </a-button-group>
      </template>
    </a-page-header>
    <a-form-model
      ref="form"
      :model="record"
      layout="vertical"
      class="form-column-split-compact"
    >
      <a-row :gutter="24">
        <!-- 问题标题 -->
        <a-col :span="formItemSpan * 4">
          <a-form-model-item
            :label="\`{ 问题标题: \${record['问题标题']} }\`"
          >
            <a-input
              v-model="record['问题标题']"
              :placeholder="$t('form.input')"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属系统 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 所属系统: \${record['所属系统']} }\`">
            <single-net-select
              v-model="record['所属系统']"
              :placeholder="$t('form.select')"
              url="/masterdata/v1/pfscategory?p_id=0&page=1&limit=20&order=&orderField=&ids=&cds=&code=&name=&q="
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属功能 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 所属功能: \${record['所属功能']} }\`">
            <single-net-select
              v-model="record['所属功能']"
              :placeholder="$t('form.select')"
              :url="\`/masterdata/v1/pfscategory?p_id=\${record['所属系统']}\`"
              :delay="!record['所属系统']"
              :cache="false"
              :disabled="!record['所属系统']"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 故障代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 故障代码: \${record['故障代码']} }\`">
            <single-net-select
              v-model="record['故障代码']"
              :placeholder="$t('form.select')"
              :url="\`/masterdata/v1/pfsfault?psId=\${record['所属功能']}\`"
              :delay="!record['所属功能']"
              :cache="false"
              :disabled="!record['所属功能']"
              value-by="id"
              label-of="name"
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 创建日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 创建日期: \${record['创建日期']} }\`">
            <a-date-picker
              v-model="record['创建日期']"
              :format="DATE_FORMAT"
              disabled
            />
          </a-form-model-item>
        </a-col>
        <!-- 供应商代码 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 供应商代码: \${record['供应商代码']} }\`">
            <net-auto-complete
              v-model="record['供应商代码']"
              url="/masterdata/v1/supplier/supplierList"
              :placeholder="$t('form.input')"
              allow-clear
              :get-popup-container="el => el.parentNode"
              dropdown-match-select-width
              value-by="supplierCode"
              search-by="name"
            />
          </a-form-model-item>
        </a-col>
        <!-- 所属分类 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 所属分类: \${record['所属分类']} }\`">
            <a-checkbox-group v-model="record['所属分类']">
              <a-row>
                <a-col :span="6">
                  <a-checkbox value="A">
                    A
                  </a-checkbox>
                </a-col>
                <a-col :span="6">
                  <a-checkbox value="B">
                    B
                  </a-checkbox>
                </a-col>
                <a-col :span="6">
                  <a-checkbox value="C">
                    C
                  </a-checkbox>
                </a-col>
                <a-col :span="6">
                  <a-checkbox value="D">
                    D
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-model-item>
        </a-col>
        <!-- 发生频次 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 发生频次: \${record['发生频次']} }\`">
            <a-input-number
              v-model="record['发生频次']"
              :placeholder="$t('form.input')"
              :min="1"
              :max="10"
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题等级 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 问题等级: \${record['问题等级']} }\`">
            <a-radio-group
              v-model="record['问题等级']"
              button-style="solid"
            >
              <a-radio-button value="a">
                A
              </a-radio-button>
              <a-radio-button value="b">
                B
              </a-radio-button>
              <a-radio-button value="c">
                C
              </a-radio-button>
              <a-radio-button value="d">
                D
              </a-radio-button>
              <a-radio-button value="e">
                E
              </a-radio-button>
            </a-radio-group>
          </a-form-model-item>
        </a-col>
        <!-- 压缩比 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 压缩比: \${record['压缩比']} }\`">
            <a-slider
              v-model="record['压缩比']"
              :tip-formatter="value => \`\${value}°C\`"
            />
          </a-form-model-item>
        </a-col>
        <!-- 里程范围 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 里程范围: \${record['里程范围']} }\`">
            <a-slider
              v-model="record['里程范围']"
              range
              :tip-formatter="value => \`\${value} KM\`"
            />
          </a-form-model-item>
        </a-col>
        <!-- TOP问题 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ TOP问题: \${record['TOP问题']} }\`">
            <a-switch
              v-model="record['TOP问题']"
            />
          </a-form-model-item>
        </a-col>
        <!-- 发布日期 -->
        <a-col :span="formItemSpan">
          <a-form-model-item :label="\`{ 发布日期: \${record['发布日期']} }\`">
            <a-range-picker
              v-model="record['发布日期']"
              :format="DATE_FORMAT"
            />
          </a-form-model-item>
        </a-col>
        <!-- 问题备注 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item :label="\`{ 问题备注: \${record['问题备注']} }\`">
            <v-textarea
              v-model="record['问题备注']"
              :auto-size="{ minRows: 6 }"
              :limit="1000"
              row
              helper-out
              allow-clear
            />
          </a-form-model-item>
        </a-col>
        <!-- 附件 -->
        <a-col :span="formItemSpan * 2">
          <a-form-model-item
            :label="\`{ 附件: \${record['附件']} }\`"
          >
            <v-upload
              v-model="record['附件']"
              :headers="headers"
              :multiple="true"
              :action="$store.getters.getUrl('/field-q/v1/file/upload?recType=30021001')"
              download="/oss/ossFile/download"
            >
              <a-button icon="upload">
                {{ $t('action.upload') }}
              </a-button>
            </v-upload>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </div>
  </template>

  <script>
  import formRecord from '@mix/form-record.js';
  import attachmentMix from '@mix/attachment.js';
  import {
  GET_MOMENT, GET_DATETIME_FORMAT, RANGE_TO_MAP_BY_FIELD, MAP_TO_RANGE_BY_FIELD,
  } from '@util/datetime-helper.js';
  import code from './NormalForm.code.js';

  export default {
  components: {
    SourceCodeView: () => import('~~/comp/SourceCodeView.vue'),
  },
  mixins: [
    formRecord({
      map () {
        this['创建日期'] = GET_MOMENT(this['创建日期']);
        MAP_TO_RANGE_BY_FIELD(this, '发布日期');
      },
    }),
    attachmentMix,
  ],
  data () {
    return {
      showSource: false,
      code,
      action: false,
      align: true,
      formItemSpan: 6,
      record: {
        创建日期: new Date(),
      },
    };
  },
  methods: {
    // 提交数据
    commit () {
      const commitValue = this.record.valueOf(function map () {
        this['创建日期'] = GET_DATETIME_FORMAT(this['创建日期']);
        RANGE_TO_MAP_BY_FIELD(this, '发布日期');
        delete this['发布日期'];
      });
      if (!this.action) {
        this.action = true;
        this.$message.loading(\`正在提交数据\${JSON.stringify(commitValue)}\`, 2, () => {
          this.action = false;
        });
      }
      console.log(commitValue);
    },
    // 加载数据
    load () {
      this.$message.loading('正在添加假数据', 0.8);
      if (!this.action) {
        this.action = true;
        const id = setTimeout(() => {
          this.record.load({
            问题标题: '问题质量管理',
            所属系统: '100000000000000001',
            所属功能: '100000000000000024',
            故障代码: '100000000000000068',
            创建日期: GET_MOMENT('2020-05-29T05:22:23.616Z'),
            供应商代码: 'A355E01697',
            所属分类: ['A', 'D'],
            发生频次: 10,
            问题等级: 'b',
            压缩比: 32,
            里程范围: [24, 49],
            TOP问题: true,
            发布日期: [GET_MOMENT('2020-05-07T05:22:23.753Z'), GET_MOMENT('2020-05-08T05:22:23.753Z')],
            发布日期Start: '2020-05-07T05:22:23.753Z',
            发布日期End: '2020-05-08T05:22:23.753Z',
            问题备注: '问题备注记录',
            附件: [{
              id: '1266238604047335425', fileName: '涉及文件更新01.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/654833642f8f4a85bf602cfda538a7d6.png', recId: null, recType: '30021001', fileSize: '1937',
            }, {
              id: '1266238604076695553', fileName: '涉及文件更新02.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/6c017487a33e4b1d9c22acf4108af441.png', recId: null, recType: '30021001', fileSize: '1937',
            }, {
              id: '1266238604160581633', fileName: '涉及文件更新03.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/c7a718de59f448fe868c7df3e137250c.png', recId: null, recType: '30021001', fileSize: '1937',
            }, {
              id: '1266238604282216450', fileName: '涉及文件更新04.png', filePath: 'data/btqisFile/1001/asq_save/2020/05/29/6d2a10952678488594e4ff1cb850fb6a.png', recId: null, recType: '30021001', fileSize: '1937',
            }],
          });
          this.action = false;
          clearTimeout(id);
        }, 800);
      }
    },
    // 重置数据
    reset () {
      this.record.reset();
    },
    // 清空数据
    clear () {
      this.record.clear();
    },
    // 缓存数据
    cache () {
      this.record.cache();
    },
  },
};
</script>`;
