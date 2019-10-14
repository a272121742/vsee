<template>
  <div>
    搜索 <a-input @change="changeKey" />
    <a-table
      :data-source="data"
      :columns="columns"
      :pagination="false"
      size="small"
      bordered
    >
    </a-table>
  </div>
</template>

<script>
const dataSource = [];

const isObject = val => val && typeof val === 'object';
function reduceTree (tree1, tree2, arr = [], bef = '') {
  const keys = Object.keys(tree1);
  keys.forEach((key) => {
    const cn = tree1[key];
    const en = tree2[key];
    const isObj = isObject(cn);
    arr.push({ key: (bef ? bef + '.' : bef) + key, zh: isObj ? '' : cn, en: isObj ? '' : en });
    if (isObj) {
      arr.push(...reduceTree(cn, en, [], (bef ? bef + '.' : bef) + key));
    }
  });
  return arr;
}
export default {
  data () {
    return {
      data: [],
      columns: [{
        title: '键',
        dataIndex: 'key',
        scopedSlots: { customRender: 'key' }
      }, {
        title: '中文',
        dataIndex: 'zh',
        scopedSlots: { customRender: 'zh' },
        width: 200
      }, {
        title: '英文',
        dataIndex: 'en',
        scopedSlots: { customRender: 'en' },
        width: 260
      }]
    };
  },
  created () {
    const msg = this.$i18n.messages;
    const d = reduceTree(msg.zh, msg.en);
    dataSource.push(...d);
    this.$set(this, 'data', d);
  },
  methods: {
    changeKey (e) {
      this.$set(this, 'data', dataSource.filter(item => ~item.key.indexOf(e.target.value)));
    }
  }
};
</script>
