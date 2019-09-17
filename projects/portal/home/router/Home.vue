<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="18">
        <a-card class="banner-card">
          <img
            slot="cover"
            src="/static/portal/portal_banner.png"
          >
        </a-card>
        <a-card
          class="module-card"
          :title="$t('title.quickEntry')"
        >
          <a-row :gutter="16">
            <a-col
              class="module-center"
              :span="8"
            >
              <div
                class="module-wrapper"
                @click.stop.prevent="jumpToModule('qis')"
              >
                <div class="module-container">
                  <img src="/static/portal/zhiliang.png">
                </div>
                <div class="module-link">
                  质量问题分析
                </div>
              </div>
            </a-col>
            <a-col
              class="module-center"
              :span="8"
            >
              <div class="module-wrapper">
                <div class="module-container">
                  <img src="/static/portal/dashuju.png">
                </div>
                <div class="module-link">
                  大数据平台
                </div>
              </div>
            </a-col>
            <a-col
              class="module-center"
              :span="8"
            >
              <div class="module-wrapper">
                <div class="module-container">
                  <img src="/static/portal/zhuisu.png">
                </div>
                <div class="module-link">
                  整车追溯
                </div>
              </div>
            </a-col>
            <a-col
              class="module-center"
              :span="8"
            >
              <div class="module-wrapper">
                <div class="module-container">
                  <img src="/static/portal/shouhou.png">
                </div>
                <div class="module-link">
                  售后质量
                </div>
              </div>
            </a-col>
            <a-col
              class="module-center"
              :span="8"
            >
              <div class="module-wrapper">
                <div class="module-container">
                  <img src="/static/portal/guocheng.png">
                </div>
                <div class="module-link">
                  过程质量
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="6">
        <!-- 公告 -->
        <announcement class="announcement-card"></announcement>
        <todo class="todo-card"></todo>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  components: {
    Announcement: () => import('../view/Announcement.vue'),
    Todo: () => import('../view/Todo.vue')
  },
  methods: {
    jumpToModule (module) {
      window.location.href = '/' + module;
    }
  }
}
</script>

<style lang="less" scoped>
  /* 门户首页banner和公告*/
  .banner-card, .announcement-card, .module-card, .todo-card {
    margin: 16px 0;
    box-shadow: 0 2px 6px 0 rgba(0,38,71,0.12);
    border-radius: 4px;
    border-radius: 4px;
  }
  .module-card {
    /deep/ .ant-card-body {
      padding-bottom: 7px;
    }
  }
  .module-center {
    text-align: center;
    .module-wrapper {
      display: inline-block;

      &:hover {
        cursor: pointer;
        .module-container {
          box-shadow: 0 6px 12px rgba(0,0,0,.11);
        }
      }
      .module-container {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100px;
        height: 100px;
        border-radius: 100px;
        border: 1px solid #e8e8e8;
        border-color: rgba(0, 0, 0, 0);
        box-shadow: 0 2px 8px rgba(0,0,0,.09);
      }
      .module-link {
        margin-top: 10px;
        margin-bottom: 28px;
        text-align: center;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
      }
    }
  }
</style>
