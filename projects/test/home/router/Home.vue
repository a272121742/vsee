<template>
  <div>
    hello 问题首页
    <net-select
      url="/getdata"
      style="width: 120px"
      placeholder="Select list"
    >
    </net-select>
    <net-tree-select
      url="/gettree"
      style="width: 120px"
      placeholder="Select tree"
      delay
    >
    </net-tree-select>
    <net-button
      url="/getdata"
      @fetch="fetch"
      @click="fetch"
    >
      ajax按钮
    </net-button>
    <prevent-button
      bind="both"
      @click="preventClick"
      ref="preventButton"
    >
      阻止二次提交
    </prevent-button>
    <a-button v-permission="'sys:dept:save'" @click="handleClick">
      普通按钮
    </a-button>
    <async-component path="/order/router/List.vue"></async-component>
  </div>
</template>
<script>
export default {
  components: {
    NetSelect: () => import('@comp/form/NetSelect.vue'),
    NetTreeSelect: () => import('@comp/form/NetTreeSelect.vue'),
    NetButton: () => import('@comp/button/NetButton.vue'),
    PreventButton: () => import('@comp/button/PreventButton.vue'),
    AsyncComponent: () => import('@comp/AsyncComponent')
  },
  methods: {
    transform (list) {
      console.log(list);
      return list;
    },
    fetch (data) {
      console.log('获取到数据', data);
    },
    preventClick (e) {
      console.log('home button', e);
      this.$nextTick(() => {
        setTimeout(() => {
          console.log('重置完成，可以点击了');
          this.$refs.preventButton.reset();
        }, 4000);
      })
    },
    handleClick () {
      console.log('handle click');
    }
  }
}
</script>
