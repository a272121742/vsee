<template>
  <div>
    <h3>详情（隐藏路由）</h3>
    <div>
      <ul>
        <li>隐藏路由以 ~ 号开头</li>
        <li>配置时需要注意层级关系</li>
        <li>
          <router-link :to="{ path: '/s7/m1' }">
            返回
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
