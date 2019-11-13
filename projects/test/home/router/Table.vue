<template>
  <v-table></v-table>
</template>

<script>
export default {
  components: {
    VTable: () => import('../view/Table.vue')
  },
  data () {
    return {
      
    };
  }
};
</script>

<style lang="less" scoped>
  .full-table {
    /deep/ .ant-table-middle td:empty {
      padding: 22px 8px!important;
    }
    /deep/ .ant-table-small td:empty {
      padding: 18px 8px!important;
    }
    /deep/ .ant-table-large td:empty {
      padding: 26px 8px!important;
    }
    /deep/ .ant-table-default td:empty {
      padding: 26px 8px!important;
    }
  }
</style>