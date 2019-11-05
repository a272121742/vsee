<template>
  <a-form 
    :form="form"
    style="width: 200px"
  >
    <a-form-item
      label="网络下拉树"
      self-update
    >
      <net-tree-select
        v-decorator="['a']"
        url="/issue/v1/faultcategory/getFaultTreeList"
        :query="{id: '${value}'}"
        :transform="transform"
      ></net-tree-select>
    </a-form-item>
    <a-form-item
      label="网络下拉树"
      self-update
    >
      <net-tree-select
        v-decorator="['b']"
        url="/issue/v1/faultcategory/getFaultTreeList"
        :query="{id: '${value}'}"
        :transform="transform"
      ></net-tree-select>
    </a-form-item>
    <net-tree-select
      :value="'100000000000000651'"
      url="/issue/v1/faultcategory/getFaultTreeList"
      :query="{id: '${value}'}"
      :transform="transform"
    ></net-tree-select>
    <a-button @click="print">
      打印
    </a-button>
  </a-form>
</template>

<script>
import { mapPropsToFields, autoUpdateFileds } from '@util/formhelper.js';
import { transform, treeTransform } from '@util/datahelper.js';


export default {
  components: {
    NetTreeSelect: () => import('../view/NetTreeSelect.vue')
  },
  data () {
    return {
      form: null,
      record: {},
      transform: treeTransform(transform({ value: 'id', label: 'name', children: 'children', selectable: item => !(item.children && item.children.length) }))
      // transform: treeTransform(keyMapTo({id: 'value', name: 'label'}))
    };
  },
  created () {
    this.mapPropsToFields = mapPropsToFields(this, ['a', 'b', 'c', 'd', 'e', 'f'], 'record');
    this.form = this.$form.createForm(this, {
      mapPropsToFields: this.mapPropsToFields,
      onValuesChange: autoUpdateFileds(this, 'record')
    });
    this.record.a = '100000000000000651';
    this.form.updateFields();
  },
  methods: {
    print () {
      console.log(this.form.getFieldsValue());
    }
  }
};
</script>