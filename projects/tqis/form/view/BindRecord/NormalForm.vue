<template>
  <a-form-model
    :model="form"
    layout="vertical"
    self-update
    class="form-column-split-compact"
  >
    <a-row>
      <a-button-group>
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
    </a-row>
    <a-row :gutter="24">
      <!-- 问题标题 -->
      <a-col :span="formItemSpan * 4">
        <a-form-model-item :label="`问题标题/${form['问题标题']}`">
          <a-input
            v-model="form['问题标题']"
            :placeholder="$t('form.input')"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- 所属系统 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="所属系统">
          <single-net-select
            v-model="form['所属系统']"
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
        <a-form-model-item label="所属功能">
          <single-net-select
            v-model="form['所属功能']"
            :placeholder="$t('form.select')"
            :url="`/masterdata/v1/pfscategory?p_id=${form['所属系统']}`"
            :delay="!form['所属系统']"
            :cache="false"
            :disabled="!form['所属系统']"
            value-by="id"
            label-of="name"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- 故障代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="故障代码">
          <single-net-select
            v-model="form['故障代码']"
            :placeholder="$t('form.select')"
            :url="`/masterdata/v1/pfsfault?psId=${form['所属功能']}`"
            :delay="!form['所属功能']"
            :cache="false"
            :disabled="!form['所属功能']"
            value-by="id"
            label-of="name"
            allow-clear
          />
        </a-form-model-item>
      </a-col>
      <!-- 创建日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="创建日期">
          <a-date-picker
            v-model="form['创建日期']"
            :format="DATE_FORMAT"
            disabled
          />
        </a-form-model-item>
      </a-col>
      <!-- 供应商代码 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="供应商代码">
          <net-auto-complete
            v-model="form['供应商代码']"
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
        <a-form-model-item label="所属分类">
          <a-checkbox-group v-model="form['所属分类']">
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
        <a-form-model-item label="发生频次">
          <a-input-number
            v-model="form['发生频次']"
            :placeholder="$t('form.input')"
            :min="1"
            :max="10"
          />
        </a-form-model-item>
      </a-col>
      <!-- 问题等级 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="问题等级">
          <a-radio-group
            v-model="form['问题等级']"
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
        <a-form-model-item label="压缩比">
          <a-slider
            v-model="form['压缩比']"
            :tip-formatter="value => `${value}°C`"
          />
        </a-form-model-item>
      </a-col>
      <!-- 里程范围 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="里程范围">
          <a-slider
            v-model="form['里程范围']"
            range
            :tip-formatter="value => `${value} KM`"
          />
        </a-form-model-item>
      </a-col>
      <!-- TOP问题 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="TOP问题">
          <a-switch
            v-model="form['TOP问题']"
          />
        </a-form-model-item>
      </a-col>
      <!-- 发布日期 -->
      <a-col :span="formItemSpan">
        <a-form-model-item label="发布日期">
          <a-range-picker
            v-model="form['发布日期']"
            :format="DATE_FORMAT"
          />
        </a-form-model-item>
      </a-col>
      <!-- 问题备注 -->
      <a-col :span="formItemSpan * 2">
        <a-form-model-item label="问题备注">
          <v-textarea
            v-model="form['问题备注']"
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
          label="附件"
        >
          <v-upload
            v-model="form['附件']"
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
</template>

<script>
import formMix from '@mix/form-record.js';
import attachmentMix from '@mix/attachment.js';
import { GET_MOMENT } from '@util/datetime-helper.js';

// const fields = ['问题标题', '所属系统', '所属功能', '故障代码', '创建日期', '供应商代码', '所属分类', '发生频次', '问题等级', '压缩比', '里程范围', 'TOP问题', '发布日期', '问题备注', '附件'];

// eslint-disable-next-line no-unused-vars
const demoData = {
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
};

export default {
  mixins: [
    formMix('form'),
    attachmentMix,
  ],
  data () {
    return {
      formItemSpan: 6,
      action: false,
      form: {
        问题标题: '默认标题',
        创建日期: GET_MOMENT('2020-05-29T05:22:23.616Z'),
      },
    };
  },
  created () {
    console.log(this);
  },
  methods: {
    commit () {
      if (!this.action) {
        this.action = true;
        this.$message.show({
          content: this.form,
          duration: 2,
          onClose: () => {
            this.action = false;
          },
        });
        console.log(this.form);
      }
    },
    load () {
      if (!this.action) {
        this.action = true;
        this.$message.show({
          content: '正在请求数据',
          duration: 2,
          onClose: () => {
            // this.form.set({}, true);
            this.form.set(demoData);
            this.action = false;
          },
        });
      }
    },
    reset () {
      this.form.reset();
    },
    clear () {
      this.form.clear();
    },
    cache () {
      this.form.cache();
    },
  },
};
</script>
