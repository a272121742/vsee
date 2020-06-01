<template>
  <codemirror
    class="codemirror-vue-demo"
    :value="code"
    :options="{...codeEditOptions, mode}"
  ></codemirror>
</template>

<script>
export default {
  components: {
    Codemirror: () => (
      // 代码类型-python
      import('codemirror/mode/vue/vue'),
      // 选中行激活
      import('codemirror/addon/selection/active-line'),
      // 代码展示组件的核心部分
      import('vue-codemirror-lite/codemirror')
    ),
  },
  props: {
    code: {
      type: String,
      default: '',
    },
    mode: {
      type: String,
      default: 'vue',
      validator (value) {
        return ['html', 'js', 'css', 'vue', 'md'].includes(value);
      },
    },
  },
  data () {
    return {
      codeEditOptions: {
        lineNumbers: true,
        lineWrapping: true,
        readOnly: 'nocursor',
        styleActiveLine: true,
      },
    };
  },

};
</script>

<style lang="less" scoped>
  .codemirror-vue-demo {
    &.vue-codemirror-wrap {
      height: 100%;
      /deep/ .CodeMirror {
        height: 100%;
      }
    }
  }
</style>
