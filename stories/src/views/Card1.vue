<template>
  <a-card :title="title || '卡片1'"></a-card>
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
    console.log('card1 created');
  }
}
</script>