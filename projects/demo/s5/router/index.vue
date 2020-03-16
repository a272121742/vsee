<template>
  <div>
    <h3>一级菜单（二级进阶）</h3>
    <div>
      <ul>
        <li>客户端文件是： index.vue</li>
        <li>服务端通过一级路由的children属性配置二级路由</li>
        <li>二级路由与一级路由同名，即可自动进阶</li>
        <li>
          进阶路由也可配置成为报表，
          <router-link :to="{path: '/s10/https%3A%2F%2Fwww.antdv.com%2F'}">
            点击查看
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>
