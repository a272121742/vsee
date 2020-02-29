<template>
  <div>
    <h3>一级参数路由</h3>
    <div>
      <ul>
        <li>通过链接可以访问参数路由</li>
        <li>
          <router-link :to="{ path: '/s8/d/11111' }">
            点击详情： id = 11111
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/s8/d/22222' }">
            点击详情： id = 22222
          </router-link>
        </li>
        <li>
          <router-link :to="{ path: '/s8/d/33333' }">
            点击详情： id = 33333
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
