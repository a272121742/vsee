<template>
  <a-card :title="$t('title.todo')">
    <a-list
      :split="false"
      :data-source="data"
      size="small"
    >
      <a-list-item
        slot="renderItem"
        slot-scope="item"
      >
        <a-list-item-meta>
          <a
            slot="title"
            href="/qis/"
          >
            <span>
              <v-icon type="iconbs_filled"></v-icon>
              {{ $t('portal_link.issue') || item.title }}
            </span>
          </a>
        </a-list-item-meta>
        <a-badge
          :count="item.total"
          show-zero
          :number-style="{backgroundColor: 'rgba(0,151,224,0.10)', color: '#0097E0'}"
        />
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
      total: 0,
    };
  },
  created () {
    this.request();
  },
  methods: {
    ...mapActions(['getTodoPage']),
    request () {
      this.getTodoPage({ limit: 6, page: 1, type: 1 }).then((res) => {
        this.data = [res];
        // this.total = res.total;
      });
    },
    format (str) {
      return moment(str).format('YYYY-MM-DD');
    },
  },
};
</script>

<style lang="less" scoped>
  .ant-card {
    height: 282px;
    /deep/ .ant-card-head {
      padding-right: 0px;
      min-height: unset;
      /deep/ .ant-card-head-title {
        padding: 12px 0;
      }
    }
    /deep/ .ant-card-body {
      padding: 8px 16px;
    }
    /deep/ .ant-list-item {
      padding: 8px 0;
      cursor: pointer;
      .ant-list-item-meta {
        flex: 2.4;
      }
      .ant-list-item-meta-title, .ant-list-item-content {
        margin-bottom: 0;
        font-size: 14px;
        line-height: 1.2;
      }
      .ant-list-item-meta-title {
        max-width: 172px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        .icon-todo {
          font-size: 14px;
          color: #40a9ff;
        }
      }
    }
  }
</style>
