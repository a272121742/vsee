<template>
  <a-card :title="$t('title.todo')">
    <a-list
      size="small"
      :split="false"
      :data-source="data"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item"
      >
        <a-list-item-meta>
          <a
            slot="title"
            :href="item.href"
          >
            {{ item.title }}
          </a>
        </a-list-item-meta>
        {{ format(item.createDate) }}
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script>
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('home');

export default {
  data () {
    return {
      data: [],
      total: 0
    }
  },
  created () {
    this.request();
  },
  methods: {
    ...mapActions(['getTodoPage']),
    request () {
      this.getTodoPage({ limit: 9 }).then(res => {
        this.data = res.list;
        this.total = res.total;
      })
    },
    format (str) {
      return moment(str).format('YYYY-MM-DD');
    }
  }
}
</script>

<style lang="less" scoped>
  .ant-card {
    /deep/ .ant-card-body {
      padding: 8px 16px;
    }
    /deep/ .ant-list-item {
      padding: 8px 0;
      .ant-list-item-meta {
        flex: 2.4;
      }
      .ant-list-item-meta-title, .ant-list-item-content {
        margin-bottom: 0;
        font-size: 12px;
        line-height: 12px;
      }
      .ant-list-item-meta-title {
        max-width: 172px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        a:before {
          content: '▎';
          font-size: 6px;
          margin-right: 4px;
          color: #40a9ff;
        }
      }
    }
  }
</style>
