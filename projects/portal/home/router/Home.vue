<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="18">
        <a-card class="shadown-block-normal banner-card">
          <img
            slot="cover"
            src="/static/portal/portal_banner.png"
          >
        </a-card>
        <a-card
          class="shadown-block-normal module-card"
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
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#iconzhiliang-"></use>
                  </svg>
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
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#icondashuju-"></use>
                  </svg>
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
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#iconzhuisu-"></use>
                  </svg>
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
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#iconshouhou-"></use>
                  </svg>
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
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#iconguocheng-"></use>
                  </svg>
                </div>
                <div class="module-link">
                  过程质量
                </div>
              </div>
            </a-col>
            <a-col
              class="module-center"
              :span="8"
            >
              <div class="module-wrapper">
                <div class="module-container">
                  <svg
                    class="icon"
                    aria-hidden="true"
                  >
                    <use xlink:href="#iconzhiliang-1"></use>
                  </svg>
                </div>
                <div class="module-link">
                  系统设置
                </div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="6">
        <!-- 公告 -->
        <announcement class="shadown-block-normal announcement-card"></announcement>
        <todo class="shadown-block-normal todo-card"></todo>
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
          box-shadow: 0 15px 24px rgba(0, 0, 0, 0.22), 0 19px 76px rgba(0, 0, 0, 0.3);
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
        transition: box-shadow 1s ease;
        box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.24), 0 1.5px 6px rgba(0, 0, 0, 0.12);
        .icon {
          font-size: 48px;
        }
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
