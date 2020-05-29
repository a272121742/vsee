<template>
  <a-tabs default-active-key="1">
    <a-tab-pane
      key="1"
      tab="form-record-mix"
    >
      <FormRecord />
    </a-tab-pane>
    <a-tab-pane
      key="2"
      tab="untwice-event"
    >
      <UntwiceEvent />
    </a-tab-pane>
  </a-tabs>
</template>

<script>
export default {
  components: {
    FormRecord: () => import('../view/FormRecord.vue'),
    UntwiceEvent: () => import('../view/UntwiceEvent.vue'),
  },
};
</script>
