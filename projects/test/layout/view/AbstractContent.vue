<template>
  <!-- 可视内容区 -->
  <div>
    <!-- <keep-alive> -->
      <!-- 一级路由 -->
      <router-view />
    <!-- </keep-alive> -->
  </div>
</template>

<style lang="less">
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 6px; /*滚动条的宽度*/
    height: 6px; /*滚动条的高度*/
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #89CDDA;
  }
  &::-webkit-scrollbar-track {
    box-shadow: 0;
    border-radius: 4px;
    background: transparent;
  }
  &::-webkit-scrollbar-thumb:horizontal { /*水平滚动条的样式*/
    width: 4px;
    background-color: transparent;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-track-piece {
    background-color: transparent; /*滚动条的背景颜色*/
    border-radius: 0; /*滚动条的圆角宽度*/
  }

  &::-webkit-scrollbar-thumb:vertical { /*垂直滚动条的样式*/
    height: 50px;
    background-color: #e6f7ff;
    border-radius: 4px;
    outline: 2px solid #fff;
    outline-offset: -2px;
    border: 2px solid #FFF;
  }
  &::-webkit-scrollbar-thumb:hover { /*滚动条的hover样式*/
    height: 50px;
    background-color: #40a9ff;
    border-radius: 4px;
  }

</style>
