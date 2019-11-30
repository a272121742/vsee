<template>
  <a-form 
    :form="form"
    style="width: 200px"
  >
    <a-form-item
      label="网络下拉（本地搜索）"
      self-update
    >
      <net-select
        v-decorator="['a']"
        placeholder="请选择"
        :transform="transform"
        allow-clear
        url="/masterdata/v1/part"
      />
    </a-form-item>
    <a-form-item
      label="网络下拉（禁用本地搜索）"
      self-update
    >
      <net-select
        v-decorator="['b']"
        placeholder="请选择"
        :transform="transform"
        allow-clear
        url="/masterdata/v1/part"
        close-search
      />
    </a-form-item>
    <a-form-item
      label="网络下拉（远程搜索）"
      self-update
    >
      <net-select
        v-decorator="['c']"
        placeholder="请选择"
        :transform="transform"
        allow-clear
        url="/masterdata/v1/part"
        :query="{name: '${search}', orderField: 'name'}"
      />
    </a-form-item>
    <a-form-item
      label="网络下拉（数据回显）"
      self-update
    >
      <net-select
        v-decorator="['d']"
        placeholder="请选择"
        :transform="transform"
        allow-clear
        url="/masterdata/v1/part"
        :query="{id: '${value}', name: '${search}', orderField: 'name'}"
      />
    </a-form-item>
    <a-form-item
      label="网络下拉（多选）"
      self-update
    >
      <net-select
        v-decorator="['e']"
        mode="multiple"
        :delay="false"
        placeholder="请选择"
        :transform="transform"
        allow-clear
        url="/masterdata/v1/part"
        :query="{ ids: '${value}', name: '${search}', orderField: 'name' }"
      />
    </a-form-item>
    <a-form-item
      label="多选文本框"
      self-update
    >
      <v-textarea
        v-decorator="['f']"
        allow-clear
        :limit="5"
        helper-out
        @change="onChange"
      />
      <v-textarea
        allow-clear
        :limit="5"
        helper-out
        @change="onChange"
      />
    </a-form-item>
    <!-- <a-select
      mode="multiple"
      label-in-value
      style="width: 100%"
      @change="onChange"
    >
      <a-select-option
        v-for="i in 25"
        :key="(i + 9).toString(36) + i"
      >
        {{ (i + 9).toString(36) + i }}
      </a-select-option>
    </a-select> -->
    <a-button @click="print">
      打印
    </a-button>
  </a-form>
</template>

<script>
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';

export default {
  components: {
    NetSelect: () => import('../view/NetSelect.vue'),
    VTextarea: () => import('@comp/form/VTextarea.vue')
  },
  data () {
    return {
      form: null,
      record: {

      }
    };
  },
  created () {
    this.mapPropsToFields = mapPropsToFields(this, ['a', 'b', 'c', 'd', 'e', 'f'], 'record');
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record')
    });
    // 已经加载的值
    // this.record.firstCausePart = '1001100000000002560';
    // this.form.updateFields();
    // 落跑值 1001100000000002314
    // this.record.d = '1001100000000002314';
    // this.form.updateFields();
    this.record.e = [
      '1001100000000002395',  // 初始化存在
      '1001100000000001015',  // 初始化存在
      '1001100000000002017',  // 初始化不存在
      '1001100000000002479'   // 初始化不存在
    ];
    this.record.f = '请测试12345';
    this.form.updateFields();
    
  },
  methods: {
    onSelect (v, o) {
      console.log('外部select', v, o);
    },
    onChange (v, o) {
      console.log('外部change', v, o);
    },
    transform (list) {
      return list.map(item => ({ value: item.id, label: item.name }));
    },
    print () {
      console.log(this.form.getFieldsValue());
    }
  }
};
</script>