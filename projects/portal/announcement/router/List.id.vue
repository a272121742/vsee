<template>
  <div class="shadown-block-normal panel-card">
    <a-row :gutter="64">
      <a-col :span="8">
        <h2 style="color: #0097E0;">
          公告
        </h2>
        <a-divider></a-divider>
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
                :href="item.href"
                @click.self.prevent="loadAnnouncement(item.id)"
              >
                {{ item.title }}
              </a>
            </a-list-item-meta>
            {{ format(item.createDate) }}
          </a-list-item>
        </a-list>
      </a-col>
      <a-col :span="16">
        <h2>{{ announcement.title || '\0' }}</h2>
        <a-divider></a-divider>
        <div class="announcement-content">
          {{ announcement.content }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import moment from 'moment';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('announcement');

export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      data: [],
      total: 0,
      selected: 0,
      announcement: {}
    };
  },
  watch: {
    id: {
      handler (id) {
        id && this.loadAnnouncement(id);
      },
      immediate: true
    }
  },
  created () {
    this.request();
  },
  methods: {
    ...mapActions(['getAnnouncementPage', 'getAnnouncement']),
    request () {
      this.getAnnouncementPage({
        limit: 7, page: 1, isPublic: 1, isPublish: 1, publish: moment().format('YYYY-MM-DD HH:mm:ss')
      }).then(res => {
        this.data = res.list;
        this.total = res.total;
        if (!this.id && this.total) {
          this.loadAnnouncement(this.data[0].id);
        }
      });
    },
    loadAnnouncement (id) {
      this.getAnnouncement(id).then(res => {
        this.$el.querySelector('.announcement-content').innerHTML = res.content;
        this.announcement = res;
      });
    },
    format (str) {
      return moment(str).format('YYYY-MM-DD');
    }
  }
};
</script>
<style lang="less" scoped>
  .panel-card {
    height: calc(100% - 200px);
    margin: 16px 0;
    background-color: #FFFFFF;
    padding: 32px 24px;
    border: 1px solid #e8e8e8;
    border-color: rgba(0, 0, 0, 0);
    box-shadow: 0 2px 8px rgba(0,0,0,.09);

    /deep/ .ant-list-item {
      padding: 16px 0;
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
          content: '•';
          font-size: 6px;
          margin-right: 4px;
          color: #40a9ff;
        }
      }
      .ant-list-item-content {
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }
</style>
