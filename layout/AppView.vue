<template>
  <!-- 可视内容区 -->
  <!-- <keep-alive> -->
  <!-- 一级路由 -->
  <keep-alive v-if="$store.state.config.keey_alive">
    <router-view />
  </keep-alive>
  <router-view v-else />
  <!-- </keep-alive> -->
</template>
