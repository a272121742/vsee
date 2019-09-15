<i18n>
{
  "en":{
    "message": "message"
  },
  "zh":{
    "message": "消息"
  }
}
</i18n>
<template>
  <div id="components-form-demo-advanced-search">
    {{ $t('message') }}
    <div class="backButton">
      <a-button
        slot="tabBarExtraContent"
        icon="rollback"
      >
        返回
      </a-button>
    </div>
    <a-card title="创建问题">
      <a-form
        class="ant-advanced-search-form"
        :form="form"
        @submit="handleSubmit"
      >
        <a-row :gutter="24">
          <a-col
            :span="16"
          >
            <a-form-item :label="`问题标题`">
              <a-input
                v-decorator="[
                  'title',
                  {
                    rules:
                      [{ required: true, message: '请输入问题标题' }]
                  }
                ]"
                placeholder="请输入问题标题"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
          >
            <a-form-item :label="`严重等级`">
              <a-select
                v-decorator="[
                  'level'
                ]"
                style="width: 120px"
                @change="levelChange"
              >
                <a-select-option value="A">
                  A
                </a-select-option>
                <a-select-option value="B">
                  B
                </a-select-option>
                <a-select-option value="C">
                  C
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="20"
          >
            <a-form-item :label="`问题描述`">
              <a-textarea
                v-decorator="[
                  'info'
                ]"
                placeholder="Autosize height based on content lines"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="5"
          >
            <a-form-item :label="`车型平台`">
              <a-select
                v-decorator="[
                  'vehicletype'
                ]"
                style="width: 120px"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`车型号`">
              <a-select
                default-value="lucy"
                style="width: 120px"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`发生阶段`">
              <a-select
                default-value="lucy"
                style="width: 120px"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`发生时间`">
              <a-select
                default-value="lucy"
                style="width: 120px"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="5"
          >
            <a-form-item :label="`故障来源`">
              <a-select
                default-value="lucy"
                style="width: 120px"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`硬件软件`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`IRT`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`负责人`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="5"
          >
            <a-form-item :label="`工厂信息`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`零件信息`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`VIN`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            :span="5"
          >
            <a-form-item :label="`供应商`">
              <a-select
                default-value="lucy"
                style="width: 120px"
                @change="handleChange"
              >
                <a-select-option value="jack">
                  Jack
                </a-select-option>
                <a-select-option value="lucy">
                  Lucy
                </a-select-option>
                <a-select-option
                  value="disabled"
                  disabled
                >
                  Disabled
                </a-select-option>
                <a-select-option value="Yiminghe">
                  yiminghe
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col
            :span="20"
          >
            <a-form-item :label="`附件`">
              <a-upload
                name="file"
                :multiple="true"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :headers="headers"
                @change="handleChange"
              >
                <a-button>
                  <a-icon type="upload" /> 上传文件
                </a-button>
              </a-upload>
              <div>支持扩展名：.rar .zip .doc .docx .pdf .jpg...</div>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col
            :span="6"
            :style="{ textAlign: 'right' }"
          >
            <a-button
              type="primary"
              html-type="submit"
              @click="handleSubmit"
            >
              提交
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="handleReset"
            >
              保存
            </a-button>
            <a-button
              :style="{ marginLeft: '8px' }"
              @click="handleReset"
            >
              取消
            </a-button>
          </a-col>
        </a-row>
      </a-form>
    </a-card>
  </div>
</template>
<script>
import { createFormFields, autoUpdateFileds } from '@util/formhelper.js';
import { createNamespacedHelpers } from 'vuex';


const { mapActions } = createNamespacedHelpers('question');

export default {
  name: 'CreateQuestion',
  components: {
    // <aaaaaa-bbbbb></aaaaaa-bbbbb>
    // AaaaaBbbbb: () => import('@comp/dssd')
  },
  data () {
    return {
      expand: false,
      form: null,
      headers: {
        authorization: 'authorization-text'
      },
      // 数据模板
      record: {
        title: '',
        level: '',
        info: '',
        vehicletype: ''

      }
    };
  },
  computed: {
    count () {
      return this.expand ? 11 : 7;
    }
  },
  created () {
    console.log(this);
    this.form = this.$form.createForm(this, {
      mapPropsToFields: () => createFormFields(this, ['title', 'level', 'info'], 'record'),
      onValuesChange: autoUpdateFileds(this, 'record')
    });
  },
  methods: {
    ...mapActions([
      'addQuestion',
      'commitQuestion',
      'updateQuestion'
    ]),
    handleSubmit () {
      this.form.validateFields(() => {
        const data = this.form.getFieldsValue();
        this.addQuestion(data).then(res => {
          console.log('新赠成功，获取到数据', res);
        });
      });
    },
    handleSearch  (e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },
    handleChange () {},
    levelChange (value) {
      console.log(`selected ${value}`);
    },
    handleReset () {
      this.form.resetFields();
    },

    toggle  () {
      this.expand = !this.expand;
    }
  }
};
</script>

<style lang="less" scoped>

.backButton{
  margin:24px 0;
}
.ant-advanced-search-form {
  padding: 24px;
  border-radius: 6px;
  /deep/ .ant-form-item {
    display: flex;
  }
  /deep/ .ant-form-item-control-wrapper {
  flex: 1;
}
}

#components-form-demo-advanced-search{
    /deep/ .ant-form {
    max-width: none;
  }
   /deep/ .search-result-list {
  margin-top: 16px;
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  text-align: center;
  padding-top: 80px;
}
}

</style>
<style lang="less">

</style>
