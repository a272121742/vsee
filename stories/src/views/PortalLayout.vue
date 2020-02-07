<template>
  <a-layout>
    <a-layout-header>
      <div class="child-view header-index-wide">
        <div class="com-info">
        </div>
        <div class="nav-info">
        </div>
      </div>
    </a-layout-header>
    <a-layout-content>
    </a-layout-content>
    <a-layout-footer>
      <div class="child-view"></div>
    </a-layout-footer>
  </a-layout>
</template>

<style lang="less" scoped>
  @header-height: 64px;
  @sider-width: 0px;
  // 设置`ant-design`的所有布局元素透明
  div[class^="ant-layout"] {
    // 覆盖`ant design`的样式，必须
    background-color: transparent!important;
    outline: 1px solid #EEE;
  }
  .ant-layout {
    position: relative;
    height: 100%;
    // 版心居中
    /deep/ .child-view {
      width: 1200px;
      margin-left: auto;
      margin-right: auto;
      transition: all .5s cubic-bezier(.55,0,.1,1);
    }
    // 顶部固定
    .ant-layout-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: @header-height;
      background: #FFF!important;
      z-index: 6000;
      padding: 0 24px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12);
      .header-index-wide {
        display: flex;
        .com-info {
          flex: 0 1 auto;
          display: flex;
          .logo {
            width: 168px;
            height: 40px;
            margin: 12px 16px 12px 0;
            background: url("/static/logo.svg") no-repeat;
            background-size: 100%;
          }
          .banner {
            height: @header-height;
          }
        }
        .nav-info {
          display: inline-flex;
          justify-content: flex-end;
          flex: 1 0 720px;
          overflow: hidden;
          .menus {
            height: @header-height;
            line-height: 62px;
            margin-right: 32px;
          }
        }
      }
    }
    .ant-layout-content {
      margin-top: @header-height;
      margin-left: @sider-width;
      transition: margin-left .3s;
      position: relative;
      min-height: calc(100% - @header-height);
      overflow-x: visible;
    }
    // 底部固定
    .ant-layout-footer {
      width: 100%;
      padding: 8px 0;
      position: fixed;
      bottom: 0;
      z-index: 6000;
    }
  }
</style>
