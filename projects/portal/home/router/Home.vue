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
          :title="$t('title.appEntry')"
          class="shadown-block-normal module-card"
        >
          <a-row style="display: flex; flex-wrap: wrap;">
            <a-col
              v-for="(m, index) in modules"
              :key="index"
              :span="6"
              class="module-center"
            >
              <template
                v-if="index < 5 || isAdmin"
              >
                <div
                  class="module-wrapper"
                  @click.stop.prevent="jumpToModule(m.path)"
                >
                  <div class="module-container">
                    <svg
                      class="icon"
                      aria-hidden="true"
                    >
                      <use :xlink:href="m.icon"></use>
                    </svg>
                  </div>
                  <div class="module-link">
                    {{ $t(`portal_link.${m.name}`) }}
                  </div>
                </div>
              </template>
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
  data () {
    return {
      modules: [{
        name: 'issue',
        path: '/qis',
        icon: '#iconportal_icon_zhiliang_default'
      }, {
        name: 'bigdata',
        path: '/',
        icon: '#iconportal_icon_dashuju_default'
      }, {
        name: 'traceability',
        path: '/',
        icon: '#iconportal_icon_zhuisu_default'
      }, {
        name: 'aftersales',
        path: '/',
        icon: '#iconportal_icon_shouhou_default'
      }, {
        name: 'manufacturing',
        path: '/',
        icon: '#iconportal_icon_guocehng_default'
      }, {
        name: 'zhushuju',
        path: '/master',
        icon: '#iconportal_icon_zhushuju_default'
      }, {
        name: 'system',
        path: '/sys',
        icon: '#iconportal_icon_xitong_default'
      }]
    };
  },
  computed: {
    isAdmin () {
      return this.$store.state.userInfo.superAdmin === 1 || this.$store.state.menus.some(item => item.appCode === 'ADMIN');
    }
  },
  methods: {
    jumpToModule (url) {
      window.location.href = url;
    }
  }
};
</script>

<style lang="less" scoped>
  /* 门户首页banner和公告*/
  .banner-card, .announcement-card, .module-card, .todo-card {
    margin: 16px 0;
    border-radius: 4px;
    border-radius: 4px;
  }
  .announcement-card {
    /deep/ .ant-card-extra {
      padding: 12px 0;
    }
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
        margin: 0 auto;
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
        display: inline-block;
        margin-top: 10px;
        margin-bottom: 28px;
        text-align: center;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
      }
    }
  }
</style>
