<template>
  <a-card :title="title || '卡片2'"></a-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  created () {
    console.log('card2 created');
  }
}
</script>