<template>
  <a-form
    v-if="!hide"
    :form="form"
        layout="inline"
      >
        <a-row :gutter="24">
          <a-col
            :span="8"
          >
            <!-- 车型 -->
            <a-form-item :label="$t('issue.vehicleModelName')">
              <net-select 
                allow-clear
                url="/masterdata/v1/vehiclemodel"
                :placeholder="$t('search.please_select') + $t('issue.vehicleModelName')"
                :transform="transformField" 
                v-decorator="['vehicleModelId']"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
          >
            <!-- 问题等级 -->
            <a-form-item :label="$t('issue.grade')">
              <net-select 
                allow-clear
                :placeholder="$t('search.please_select') + $t('issue.grade')" 
                url="/sys/dict?dictType=issue_grade"
                :transform="transformField"
                v-decorator="['grade']"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
          >
            <!-- 问题分类 -->
            <a-form-item :label="$t('issue.source')">
              <net-select 
                allow-clear
                url="/sys/dict?dictType=issue_source"
                :cache="false"
                :delay="!record.source"
                :placeholder="$t('search.please_select') + $t('issue.source')"
                :transform="transformField" 
                v-decorator="['source']"
              />
            </a-form-item>
          </a-col>
          <!-- 
          <a-col
            :span="8"
          >
            <a-form-item label="$t('search.#责任人')">
              <a-input
                v-decorator="[
                  'TODO:3'
                ]"
                placeholder="$t('search.title')"
              />
            </a-form-item>
          </a-col>
          -->
          <a-col
            :span="8"
            style="float: right;"
          >
          <a-form-item
          >
            <span
              style="float: right; overflow: hidden;"
            >
              <a-button
                type="primary"
                @click="submitSearch"
              >
                {{ $t('search.search_button')}}
              </a-button>
              <a-button
                @click="resetSearch"
              >
                {{ $t('search.reset_button')}}
              </a-button>
              <a-button
                @click="cancelSearch"
              >
                {{ $t('search.cancel_button')}}
              </a-button>
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
</template>

<script>
import {createFormFields, autoUpdateFileds} from '@util/formhelper.js';

export default {
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue')
  },
  props: {
    hide: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      advanced: false,
      form: null,
      record: {

      }
    }
  },
  watch: {
    advanced (value) {
      if (value) {
        this.form.updateFields(this.mapPropsToFields());
        const record = this.form.getFieldsValue();
      }
    }
  },
  created () {
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record')
    });
  },
  methods: {
    /**
     * 字段映射函数
     */
    mapPropsToFields () {
      return createFormFields(this, [
        'vehicleModelId', 'grade', 'source'
        
      ], 'record');
    },
    /**
     * 提交搜索内容
     */
    submitSearch () {
      const record = this.form.getFieldsValue();
      this.$emit('change', this.record);
    },
    /**
     * 重置搜索内容
     */
    resetSearch () {
      this.$set(this, 'record', {});
      this.form.updateFields(this.mapPropsToFields());
      this.$emit('change', this.record);
    },
    /**
     * 取消搜索
     */
    cancelSearch () {
      console.log(1);
      this.$emit('hidden');
    },
    /**
     * 转换net-select获取的参数
     */
    transformField(list) {
      return list.map((item) => ({
        value: item.id,
        label: item.name
      }));
    },
  }
}
</script>

<style lang="less" scoped>

</style>