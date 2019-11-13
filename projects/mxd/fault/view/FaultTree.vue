<template>
  <a-dropdown 
    :trigger="['contextmenu']"
    :visible="showContextMenu"
  >
    <div style="user-select: none; height: 100%;">
      <a-tree
        :tree-data="treeData"
        @click.native="treeClick"
        @rightClick="treeRightClick"
      />
    </div>
    <a-menu
      slot="overlay"
      style="width: 200px;"
    >
      <a-menu-item
        v-if="allow1"
        key="1"
      >
        增加平级
      </a-menu-item>
      <a-menu-item
        v-if="allow2"
        key="2"
      >
        增加子集
      </a-menu-item>
      <a-menu-item
        v-if="allow3"
        key="3"
      >
        删除
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import { treeTransform } from '@util/datahelper.js';

const { mapActions } = createNamespacedHelpers('fault');

export default {
  data () {
    return {
      showContextMenu: false,
      allow1: true,
      allow2: true,
      allow3: true,
      treeData: [
        {
          title: '0-0',
          key: '0-0',
          id: '1',
          cdb: 'a',
          children: [
            {
              title: '0-0-0',
              key: '0-0-0',
              id: '2',
              cdb: 'b',
              children: [
                { title: '0-0-0-0', key: '0-0-0-0', id: '3', cdb: 'c' },
                { title: '0-0-0-1', key: '0-0-0-1', id: '4', cdb: 'd' },
                { title: '0-0-0-2', key: '0-0-0-2', id: '5', cdb: 'e' },
              ],
            },
            {
              title: '0-0-1',
              key: '0-0-1',
              children: [
                { title: '0-0-1-0', key: '0-0-1-0' },
                { title: '0-0-1-1', key: '0-0-1-1' },
                { title: '0-0-1-2', key: '0-0-1-2' },
              ],
            },
            {
              title: '0-0-2',
              key: '0-0-2',
            },
          ],
        },
        {
          title: '0-1',
          key: '0-1',
          children: [
            { title: '0-1-0-0', key: '0-1-0-0' },
            { title: '0-1-0-1', key: '0-1-0-1' },
            { title: '0-1-0-2', key: '0-1-0-2' },
          ],
        },
        {
          title: '0-2',
          key: '0-2',
        },
      ]
    };
  },
  created () {
    console.log('创建组件');
    this.fetch();
  },
  activated () {
    console.log('重新激活');
    this.fetch();
  },
  methods: {
    ...mapActions(['getPfsCategoryTree']),
    fetch () {
      this.getPfsCategoryTree().then(res => {
        console.log(res);
        console.log(treeTransform((item) => ({ ...item, title: item.name, key: item.id }), res));
        this.treeData = treeTransform((item) => ({ ...item, title: item.name, key: item.id }), res);
      });
    },
    treeClick (e) {
      this.showContextMenu = false;
      console.log('treeClick', e);
    },
    treeRightClick ({ node }) {
      this.showContextMenu = true;
      console.log('treeRightClick', node.$options.propsData);
      const dataRef = node.$options.propsData.dataRef || {};
      const id = dataRef.id;
      this.allow1 = !!id;
      this.allow2 = !!id;
      this.allow3 = !dataRef.children;
    }

  }

};
</script>

<style lang="less" scoped>
  .ant-dropdown-trigger {
    /deep/ .ant-tree {
      height: 100%;
    }
  }
  
</style>