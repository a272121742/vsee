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
            <a-form-item label="$t('issue.#车型')">
              <!-- <a-input
                v-decorator="[
                  'TODO:0'
                ]"
                placeholder="$t('search.title')"
              /> -->
              <net-select 
                url="/masterdata/v1/vehiclemodel"
                v-decorator="[
                  'vehicleModelId'
                ]"
                placeholder="$t('search.title')"
              >
              </net-select>
            </a-form-item>
          </a-col>

          <a-col
            :span="8"
          >
            <a-form-item label="$t('#问题等级')">
              <a-input
                v-decorator="[
                  'TODO:1'
                ]"
                placeholder="$t('search.title')"
              />
            </a-form-item>
          </a-col>
          <a-col
            :span="8"
          >
            <a-form-item label="$t('search.#问题涞源')">
              <a-input
                v-decorator="[
                  'TODO:2'
                ]"
                placeholder="$t('search.title')"
              />
            </a-form-item>
          </a-col>
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
        'TODO:0', 
        'TODO:1', 'TODO:2', 'TODO:3', 'TODO:4',
        
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
  }
}
</script>

<style lang="less" scoped>

</style>