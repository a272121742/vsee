<template>
  <div>
    <a-page-header
      title="本地搜索"
      sub-title="少量数据启用本地搜索模式"
    >
    </a-page-header>
    <Location class="padding-left-24" />
    <a-page-header
      title="禁用搜索"
      sub-title="启用一个无输入项的下拉模式"
    >
    </a-page-header>
    <CloseSearch class="padding-left-24" />
    <a-page-header
      title="远程搜索"
      sub-title="通过向服务端发送请求获取新的搜索结果"
    >
    </a-page-header>
    <Remote class="padding-left-24" />
    <a-page-header
      title="联想输入"
      sub-title="保留用户输入以提供外部列表模糊搜索功能"
    >
    </a-page-header>
    <Fuzzy class="padding-left-24" />
  </div>
</template>

<script>
export default {
  components: {
    Location: () => import('./QuerySelect/Location.vue'),
    CloseSearch: () => import('./QuerySelect/CloseSearch.vue'),
    Remote: () => import('./QuerySelect/Remote.vue'),
    Fuzzy: () => import('./QuerySelect/Fuzzy.vue'),
  },
};
</script>
