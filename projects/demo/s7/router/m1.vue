<template>
  <div>
    <h3>二级菜单（隐藏路由）</h3>
    <div>
      <ul>
        <li>通过链接可以访问隐藏路由</li>
        <li>
          <router-link :to="{ path: '/s7/m1/d1' }">
            点击详情
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
