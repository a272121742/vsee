<template>
  <div>
    <a-page-header
      title="级联联动"
      sub-title="具备上下级别的联动组合"
    >
    </a-page-header>
    <Trible class="padding-left-24" />
    <a-page-header
      title="同源互联"
      sub-title="设置统一源头显示不同内容"
    >
    </a-page-header>
    <Double class="padding-left-24" />
  </div>
</template>

<script>
export default {
  components: {
    Trible: () => import('./LinkageCombination/Trible.vue'),
    Double: () => import('./LinkageCombination/Double.vue'),
  },
};
</script>
