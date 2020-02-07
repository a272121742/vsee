<template>
  <a-modal
    :visible="visible"
    centered
    :mask-closable="false"
    :z-index="6000"
    :title="$t('issue.dialogTitle')"
    :width="1280"
    :body-style="{padding: '16px 24px'}"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div>
      <vehicle-search-dialog-form />
      <vehicle-search-dialog-table
        :selected-keys="selectedKeys"
        :multiple-select="multipleSelect"
        @select="rowSelect"
      />
    </div>
  </a-modal>
</template>
<script>

import tableRowSelectionMix from '@mix/table-row-selection.js';

export default {
  components: {
    'vehicle-search-dialog-form': () => import('./vehicle-search-dialog-form.vue'),
    'vehicle-search-dialog-table': () => import('./vehicle-search-dialog-table.vue'),
  },
  mixins: [tableRowSelectionMix()],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    multipleSelect: {
      type: Boolean,
      default: true,
    },
  },
  data () {
    return {
      selectedKeys: [],
    };
  },
  watch: {
    visible (value) {
      if (value) {
        this.selectedKeys = this.$store.state.issue.selectedVehicleRowKeys;
      }
    },
  },
  created () {
    if (this.$route.query.asqIssueRptType !== undefined) {
      this.$store.commit('issue/set', { selectedVehicleRowKeys: [] });
    }
  },
  methods: {
    handleOk () {
      this.$store.commit('issue/set', { selectedVehicleRowKeys: this.selectedKeys });
      this.$emit('update:visible', false);
      this.reset();
    },
    handleCancel () {
      this.reset();
      this.$emit('update:visible', false);
    },
    rowSelect (selectedKeys) {
      this.selectedKeys = selectedKeys;
    },
    reset () {
      this.$set(this, 'selectedKeys', []);
    },
  },
};
</script>
