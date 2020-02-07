<template>
  <div>创建或修改单车报告 {{ `报告详情：${id}` }}</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
