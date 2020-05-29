<template>
  <div>
    <a-page-header
      title="表单绑值"
      sub-title="使用内置form-record插件自动绑值"
    >
    </a-page-header>
    <NormalForm class="padding-left-24" />
    <a-page-header
      title="动态表单"
      sub-title="内置form-record支持动态表单绑值"
    >
    </a-page-header>
    <DynamicForm class="padding-left-24" />
  </div>
</template>

<script>
export default {
  components: {
    NormalForm: () => import('./BindRecord/NormalForm.vue'),
    DynamicForm: () => import('./BindRecord/DynamicForm.vue'),
  },
  data () {
    return {
    };
  },
};
</script>
