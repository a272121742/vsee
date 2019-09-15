<template>
  <div
    class="successContent"
  >
    <img src="/static/question/successIcon.png">
    <p class="successText">
      {{ successText }}
    </p>
    <p class="successInfo">
      {{ successInfo }}
    </p>
    <div class="backBtnDiv">
      <a-button
        type="primary"
        class="backBtn"
        @click="goBack"
      >
        返回
      </a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'QuestionSuccess',
  props: ['name'],
  data () {
    return {
      successText: '保存成功',
      successInfo: '您创建的内容已经提交成功，可在“我的问题 - 草稿”中查看。'

    };
  },
  created () {
    this.init();
  },
  methods: {
    init () {
      if (this.name === 'save') {
        this.successText = '保存成功';
        this.successInfo = '您创建的内容已经提交成功，可在“我的问题 - 草稿”中查看。'
      } else if (this.name === 'submit') {
        this.successText = '提交成功';
        this.successInfo = '您创建的内容已经提交成功，可在“我的问题 - 已创建”中查看。'
      }
    },
    goBack () {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less" scoped>
  .successContent{
    width:1176px;
    height:346px;
    background: #FFFFFF;
    box-shadow: 0 2px 6px 0 rgba(0,39,102,0.12);
    border-radius: 4px;
    border-radius: 4px;
    margin-top:16px;
    text-align: center;
    img{
      margin-top:72px;
      width:72px;
      height:72px;
    }
    .successText{
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      color: rgba(0,0,0,0.85);
      margin-top:32px;
    }
    .successInfo{
        font-family: SourceHanSansCN-Normal;
        font-size: 14px;
        color: rgba(0,0,0,0.45);
    }

    .backBtnDiv{
     width:100%;
      .backBtn{
        background: #0098E0;
        box-shadow: 0 0 8px 0 rgba(0,0,0,0.06);
        border-radius: 4px;
        border-radius: 4px;
        width:80px;
        height:32px;
        margin-top:24px;
        margin-bottom:40px;

      }
    }

  }
</style>
