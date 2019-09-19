<template>
  <a-table
    :columns="columns"
    :row-key="record => record.no"
    :data-source="data"
  >
    <span
      slot="id"
      slot-scope="text, record"
    >
      <template>
        <a @click="e => viewOrder(record.id)">编辑</a>
      </template>
    </span>
  </a-table>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('order');

const columns = [{
  title: 'id',
  dataIndex: 'id',
  scopedSlots: { customRender: 'id' }
}, {
  title: 'no',
  dataIndex: 'no',
  scopedSlots: { customRender: 'no' }
}, {
  title: 'title',
  dataIndex: 'title',
  scopedSlots: { customRender: 'title' }
}];
export default {
  data () {
    return {
      columns,
      data: []

    }
  },
  created () {
    this.fetch();
  },
  methods: {
    ...mapActions([
      'getOrderList'
    ]),
    fetch () {
      this.getOrderList().then(res => {
        console.log(res);
        this.data = res.data;
      })
    },
    viewOrder (id) {
      this.$router.push({
        name: 'View',
        params: {
          id
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>

</style>
