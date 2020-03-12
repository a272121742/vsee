<template>
  <a-card :title="title || '卡片3'"></a-card>
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
    console.log('card3 created');
  }
}
</script>