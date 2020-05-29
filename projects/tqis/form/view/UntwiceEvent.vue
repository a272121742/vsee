<template>
  <a-row>
    <a-col :span="4">
      <a-button
        ref="submitButton"
        type="primary"
        :disabled="committing"
        :loading="committing"
        @click="commit"
      >
        提交
      </a-button>
    </a-col>
    <a-col :span="4">
      <a-button @click="triggerCommmit">
        触发提交10次
      </a-button>
    </a-col>
  </a-row>
</template>

<script>
export default {
  data () {
    return {
      clickCount: 0,
      commitCount: 0,
      committing: false,
    };
  },
  methods: {
    commit () {
      this.clickCount += 1;
      this.$message.show({ content: `点击了${this.clickCount}次` });
      if (!this.committing) {
        this.committing = true;
        this.commitCount += 1;
        this.$message.show({ content: `提交中，提交了${this.commitCount}次` });
        console.log('commintting...');
        setTimeout(() => {
          this.committing = false;
          this.commitCount = 0;
        }, 1000);
      }
    },
    triggerCommmit () {
      const btn = this.$refs.submitButton;
      let progress = 0;
      function triggerClick () {
        progress += 1;
        if (progress < 10) {
          if (btn && btn.$el) {
            btn.$el.click();
          }
          requestAnimationFrame(triggerClick);
        }
      }
      requestAnimationFrame(triggerClick);
    },
  },
};
</script>
