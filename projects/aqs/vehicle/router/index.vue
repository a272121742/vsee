<template>
  <div style="text-align: center;">
    <!-- 车辆信息查询 - 查询表单 -->
    <vehicle-search-form></vehicle-search-form>
    <!-- 车辆信息查询 - 表格 -->
    <!-- <vehicle-list-table></vehicle-list-table> -->
    <vehicle-list-table />
  </div>
</template>

<script>
export default {
  components: {
    'vehicle-list-table': () => import('../view/vehicle-list-table.vue'),
    'vehicle-search-form': () => import('../view/vehicle-search-form.vue'),
  },
  created () {
    console.log('created');
  },
};
</script>
