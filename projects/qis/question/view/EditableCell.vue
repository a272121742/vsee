<template>
  <div class="editable-cell">
    <div
      v-if="editable"
      class="editable-cell-input-wrapper"
    >
      <a-input
        :value="value"
        @change="handleChange"
        @pressEnter="check"
      /><a-icon
        @click="check"
        type="check"
        class="editable-cell-icon-check"
      />
    </div>
    <div
      v-else
      class="editable-cell-text-wrapper"
    >
      {{ value || ' ' }}
      <a-icon
        @click="edit"
        type="edit"
        class="editable-cell-icon"
      />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      value: this.text,
      editable: false
    };
  },
  methods: {
    handleChange (e) {
      const value = e.target.value;
      this.value = value;
    },
    check () {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit () {
      this.editable = true;
    }
  }
};
</script>
