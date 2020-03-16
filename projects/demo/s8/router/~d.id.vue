<template>
  <div>
    <h3>详情（参数路由）id = {{ id }}</h3>
    <div>
      <ul>
        <li>隐藏路由以 ~ 号开头</li>
        <li>参数路由以 .param 命名在vue前面</li>
        <li>
          <a href="https://router.vuejs.org/zh/guide/essentials/passing-props.html">完全按照路由参数的方式进行的解耦</a>
        </li>
        <li>
          <router-link :to="{ path: '/s8' }">
            返回
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: '',
    },
  },
};
</script>
