<template>
  <div>
    <NormalForm />
    <DynamicForm />
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
