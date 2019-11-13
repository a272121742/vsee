<template>
  <h1>
    弹出框
    <a-button
      type="primary"
      @click="$message.show({ content: '这是一个短消息' })"
    >
      弹出短消息
    </a-button>
    <a-button
      type="primary"
      @click="$message.show({ content: '消息10秒后消失', duration: 10 })"
    >
      消息10秒后消失
    </a-button>
    <a-button
      type="primary"
      @click="$message.show({ content: '消息3秒后消失', duration: 3 })"
    >
      消息3秒后消失
    </a-button>
    <a-button
      type="primary"
      @click="$message.show({ content: 'loading状态' + Date.now(), type: 'loading' })"
    >
      loading状态
    </a-button>
    <a-button
      type="primary"
      @click="asyncCommitMessage"
    >
      异步提交信息
    </a-button>
  </h1>
</template>

<script>
export default {
  data () {
    return {
      message: '消息提示'
    };
  },
  created () {
    // this.$message.show({content: '提示信息', type: 'info', duration: 4});
  },
  methods: {
    asyncCommitMessage () {
      this.$message.show({ content: '正在提交消息', type: 'loading' });
      setTimeout(() => {
        this.$message.show({ content: '正在保存' });
        setTimeout(() => {
          this.$message.show({ content: '正在进行数据审核' });
          setTimeout(() => {
            this.$message.show({ content: '正在提交工作流' });
            setTimeout(() => {
              this.$message.show({ content: '正在更新状态' });
              setTimeout(() => {
                this.$message.show({ content: '提交成功', type: 'success', duration: 3 });
              }, 1500);
            }, 1500);
          }, 1500);
        }, 1500);
      }, 1500);
    },
    changeMessage () {
      this.$message.show({content: '内从更新'});
      this.$message.close();
    }
  }
};
</script>