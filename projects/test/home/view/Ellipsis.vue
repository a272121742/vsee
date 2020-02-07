<template>
  <div
    :class="['vx-ellipsis-text', showAll ? 'reveal' : '']"
    :style="{'max-height': maxHeight}"
  >
    <div
      v-if="hasMore"
      class="ellipsis-container"
      :style="{'-webkit-line-clamp': line, 'fontSize': revealWidth + 'px'}"
    >
      <div
        v-if="isHtml"
        ref="txtContent"
        class="ellipsis-content html"
        v-html="content"
      ></div>
      <div
        v-else
        ref="txtContent"
        class="ellipsis-content more"
      >
        {{ content | trimEnter }}
      </div>
      <div
        v-if="hasMore"
        class="ellipsis-ghost"
      >
        <div
          class="ellipsis-placeholder"
          :style="{'height': maxHeight}"
        ></div>
        <div
          :class="['ellipsis-more', isHtml ? 'html' : '']"
          :style="{'width': revealWidth + 'px'}"
          @click="more"
        >
          {{ revealText }}
        </div>
      </div>
    </div>
    <div v-else>
      <div
        v-if="isHtml"
        ref="txtContent"
        class="ellipsis-content"
        :style="{'-webkit-line-clamp': line}"
        v-html="content"
      ></div>
      <div
        v-else
        ref="txtContent"
        class="ellipsis-content"
        :style="{'-webkit-line-clamp': line}"
      >
        {{ content | trimEnter }}
      </div>
    </div>
    <div
      v-if="showAll"
      class="ellipsis-fold-text"
      @click="fold"
    >
      {{ foldText }}
    </div>
  </div>
</template>

<script>
export default {
  filters: {
    trimEnter (data) {
      return data ? data.replace(/[\r\n]/g, '') : '';
    },
  },
  props: {
    /* 文字内容 */
    content: {
      type: String,
      default: '',
    },
    /* 展示几行文字 */
    line: {
      type: Number,
      default: 1,
    },
    /* 点击更多时候是否触发展开操作 */
    triggerMore: {
      type: Boolean,
      default: true,
    },
    /* 是否显示更多按钮 */
    hasMore: {
      type: Boolean,
      default: false,
    },
    /* 是否是html内容 */
    isHtml: {
      type: Boolean,
      default: false,
    },
    /* 更多按钮宽度 */
    revealWidth: {
      type: Number,
      default: 70,
    },
    /* 更多按钮文案 */
    revealText: {
      type: String,
      default: '【全部】',
    },
    /* 收起按钮文案 */
    foldText: {
      type: String,
      default: '收起',
    },
  },
  data () {
    return {
      showAll: false, // 是否展示所有内容
      fontSize: 14, // 默认字号14px
      lineHeight: 22, // 默认行高22
    };
  },
  computed: {
    maxHeight () {
      return `${this.lineHeight * this.line }px`;
    },
  },
  watch: {
    content () {
      this.showAll = false;
    },
  },
  mounted () {
    this.$nextTick(() => {
      const txtEle = this.$refs.txtContent;
      if (txtEle.currentStyle) {
        this.fontSize = Number(txtEle.currentStyle.fontSize.replace('px', ''));
        this.lineHeight = Number(
          txtEle.currentStyle.lineHeight.replace('px', ''),
        );
      } else {
        this.fontSize = Number(
          getComputedStyle(txtEle).fontSize.replace('px', ''),
        );
        this.lineHeight = Number(
          getComputedStyle(txtEle).lineHeight.replace('px', ''),
        );
      }
      // console.log(this.maxHeight);
      // console.log(this.lineHeight);
      // console.log(this.fontSize);
    });
  },
  methods: {
    // countHeight() {},
    /* 展开 */
    more () {
      this.$emit('reveal');
      if (this.triggerMore) {
        this.showAll = true;
        this.lineHeight = 9999; // 增加行高上限，以展示完整内容
      }
    },
    /* 收起 */
    fold () {
      this.$emit('fold');
      this.showAll = false;
      this.lineHeight = 22;
    },
  },
};
</script>

<style lang="less" scoped>
/*
 * 行高 h
 * 字号 f
 * 最大行数 n
 * ...更多容器的宽 w
 */
.vx-ellipsis-text {
  @keyframes width-change {
    0%,
    100% {
      width: 100%;
    }
    50% {
      width: 30%;
    }
  }
  position: relative;
  width: 100%;
  max-height: 66px; /* h*n */
  line-height: 22px; /* h */
  overflow: hidden;
  color: #333;
  // animation: width-change 8s ease infinite;
  .ellipsis-container {
    position: relative;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3; /* n */
    font-size: 70px; /* w */
    color: transparent;
    span {
      display: -webkit-box;
    }
  }
  .ellipsis-content {
    vertical-align: top;
    color: #333;
    // text-align: justify;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    font-size: 14px; /* f */
    white-space: pre-wrap;
    &.more {
      display: inline;
    }
  }
  .ellipsis-ghost {
    position: absolute;
    z-index: 1;
    top: 0;
    left: 50%;
    width: 100%;
    height: 100%;
    color: #000;
    // background: rgba(255, 0, 0, 0.16);
  }
  .ellipsis-ghost:before {
    content: '';
    display: block;
    float: right;
    width: 50%;
    height: 100%;
  }
  .ellipsis-placeholder {
    content: '';
    display: block;
    float: right;
    width: 50%;
    height: 66px; /* h*n */
  }
  .ellipsis-more {
    float: right;
    text-align: right;
    font-size: 14px; /* f */
    width: 70px; /* w */
    height: 22px; /* h */
    margin-top: -22px; /* -h */
    cursor: pointer;
    color: #3a62f4;
    &.html {
      padding-left: 20px;
      background: linear-gradient(left, #fff0 15%, #fff 46%);
    }
  }
  .ellipsis-fold-text {
    position: relative;
    z-index: 5;
    cursor: pointer;
    // text-align: right;
    font-size: 14px;
    color: #3a62f4;
  }
  &.reveal {
    max-height: auto !important;
    .ellipsis-container {
      display: block !important;
    }
  }
}
</style>
