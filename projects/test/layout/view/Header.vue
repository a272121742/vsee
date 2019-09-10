<template>
  <a-layout-header>
    <div class="header-index-wide">
      <div class="header-index-left">
        <div class="logo">
        </div>
        <a-menu
          theme="dark"
          mode="horizontal"
        >
          <a-menu-item
            v-for="menu in menus"
            :key="menu.key"
            :title="$t(menu.key)"
            @click="jump(menu.path)"
          >
            {{ $t(menu.key) }}
          </a-menu-item>
        </a-menu>
      </div>
      <div class="header-index-right user-wrapper">
        <div class="content-box">
          <language-dropdown>
          </language-dropdown>
          <a-dropdown :trigger="['click', 'hover']">
            <a-button
              shape="circle"
              icon="user"
            />
            <a-menu slot="overlay">
              <a-menu-item key="0">
                <a href="http://www.alipay.com/">编辑信息</a>
              </a-menu-item>
              <a-menu-item key="1">
                <a href="http://www.taobao.com/">退出系统</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    LanguageDropdown: () => import('@comp/i18n/LanguageDropdown.vue')
  },
  data () {
    return {
      menus: [{
        key: 'Home',
        path: '/'
      }, {
        key: 'MyQuestion',
        path: '/question/list'
      }, {
        key: 'AdvanceSearch',
        path: '/question/search'
      }]
    };
  },
  methods: {
    jump (path) {
      this.$router.push({ path });
    }
  }
}
</script>

<style lang="less" scoped>
  /* 重写头部 */
  .ant-layout-header {
    /deep/ .ant-menu-item {
      height: 64px;
      line-height: 64px;
    }
    .header-index-wide {
      max-width: 1200px;
      margin: auto;
      padding-left: 0;
      display: flex;
      height: 64px;
    }

    .header-index-left {
      flex: 0 1 1080px;
      display: flex;
      .logo.top-nav-header {
        flex: 0 0 165px;
        width: 165px;
        height: 64px;
        position: relative;
        line-height: 64px;
        transition: all 0.3s;
        overflow: hidden;

        img,
        svg {
          display: inline-block;
          vertical-align: middle;
          height: 32px;
          width: 32px;
        }

        h1 {
          color: #fff;
          display: inline-block;
          vertical-align: top;
          font-size: 16px;
          margin: 0 0 0 12px;
          font-weight: 400;
        }
      }
    }

    .header-index-right {
      flex: 1 0 auto;
      height: 64px;
      overflow: hidden;
      color: rgba(255, 255, 255, .65);

      .content-box {
        float: right;
        button, span {
          margin-left: 24px;
        }
      }
    }
    .user-wrapper {
      float: right;
      height: 100%;
    }
  }
</style>
