<template>
  <div class="app-result-container">
    <a-result
      status="500"
      title="500"
      :sub-title="$t('request.500')"
    >
      <template #extra>
        <a-button
          size="large"
          style="width: 200px;"
          @click="goHome"
        >
          {{ $t('action.go_home') }}
        </a-button>
        <a-button
          size="large"
          style="width: 200px; margin-left: 48px;"
          type="primary"
          @click="goBack"
        >
          {{ $t('action.back') }}
        </a-button>
      </template>
    </a-result>
  </div>
</template>

<script>
export default {
  name: 'Error500',
  methods: {
    goBack () {
      this.$router.go(-1);
    },
    goHome () {
      this.$router.push('/');
    },
  },
};
</script>
