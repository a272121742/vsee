<template>
  <div>
    <Normal />
    <Memory />
  </div>
</template>

<script>
export default {
  components: {
    Normal: () => import('./RowSelection/Normal.vue'),
    Memory: () => import('./RowSelection/Memory.vue'),
  },
  data () {
    return {

    };
  },
  methods: {

  },
};
</script>
