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
          <a-row style="display: flex; flex-wrap: wrap; height: 312px;">
            <template
              v-for="(m, index) in modules"
            >
              <a-col
                v-if="m.visible !== false"
                :key="index"
                :span="6"
                class="module-center"
              >
                <div
                  class="module-wrapper"
                  @click.stop.prevent="jumpToModule(m.path)"
                >
                  <div class="module-container">
                    <v-icon :type="m.icon"></v-icon>
                  </div>
                  <div class="module-link">
                    {{ $t(`portal_link.${m.name}`) }}
                  </div>
                </div>
              </a-col>
            </template>
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
    Todo: () => import('../view/Todo.vue'),
  },
  // data () {
  //   const { menus, userInfo } = this.$store.state;
  //   return {
  //     modules: [{
  //       name: 'issue',
  //       path: '/qis',
  //       icon: 'iconzlwt_twoTone',
  //       visible: menus.some((item) => item.appCode === 'ISSUE'),
  //     }, {
  //       name: 'bigdata',
  //       path: '/',
  //       icon: 'icondsj_twoTone',
  //     }, {
  //       name: 'traceability',
  //       path: '/',
  //       icon: 'iconxxzs_twoTone',
  //     }, {
  //       name: 'aftersales',
  //       path: '/aqs',
  //       icon: 'iconshzl_twoTone',
  //       visible: menus.some((item) => item.appCode === 'AQS'),
  //     }, {
  //       name: 'manufacturing',
  //       path: '/',
  //       icon: 'icongczs_twoTone',
  //     }, {
  //       name: 'zhushuju',
  //       path: '/master',
  //       icon: 'iconzsj_twoTone',
  //       visible: menus.some((item) => item.appCode === 'MASTER'),
  //     }, {
  //       name: 'system',
  //       path: '/sys',
  //       icon: 'iconxtsz_twoTone',
  //       visible: userInfo.superAdmin === 1 || menus.some((item) => item.appCode === 'ADMIN'),
  //     }],
  //   };
  // },
  computed: {
    isAdmin () {
      return this.$store.state.userInfo.superAdmin === 1 || this.$store.state.menus.some((item) => item.appCode === 'ADMIN');
    },
    isAqs () {
      return this.$store.state.menus.some((item) => item.appCode === 'AQS');
    },
    modules () {
      const { menus, userInfo } = this.$store.state;
      return [{
        name: 'issue',
        path: '/qis',
        icon: 'iconzlwt_twoTone',
        visible: userInfo.superAdmin === 1 || menus.some((item) => item.appCode === 'ISSUE'),
      }, {
        name: 'bigdata',
        path: '/',
        icon: 'icondsj_twoTone',
      }, {
        name: 'traceability',
        path: '/',
        icon: 'iconxxzs_twoTone',
      }, {
        name: 'aftersales',
        path: '/aqs',
        icon: 'iconshzl_twoTone',
        visible: userInfo.superAdmin === 1 || menus.some((item) => item.appCode === 'AQS'),
      }, {
        name: 'manufacturing',
        path: '/',
        icon: 'icongczs_twoTone',
      }, {
        name: 'zhushuju',
        path: '/master',
        icon: 'iconzsj_twoTone',
        visible: userInfo.superAdmin === 1 || menus.some((item) => item.appCode === 'MASTERDATA'),
      }, {
        name: 'system',
        path: '/sys',
        icon: 'iconxtsz_twoTone',
        visible: userInfo.superAdmin === 1 || menus.some((item) => item.appCode === 'ADMIN'),
      }];
    },
  },
  methods: {
    jumpToModule (url) {
      window.location.href = url;
    },
  },
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
    height: 156px;
    text-align: center;
    .module-wrapper {
      display: inline-block;
      &:hover {
        cursor: pointer;
        .module-container {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.12);
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
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.12);
        .icon {
          font-size: 48px;
        }
      }
      .module-link {
        display: inline-block;
        margin-top: 10px;
        text-align: center;
        font-size: 12px;
        color: rgba(0,0,0,0.65);
      }
    }
  }
</style>
