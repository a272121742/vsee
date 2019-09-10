# vsee

> A Vue.js project

## study guide

- [vue（前端核心框架）](https://cn.vuejs.org/v2/guide/)
- [ant-design-vue（前端UI组件）](https://vue.ant.design/docs/vue/introduce-cn/)
- [vue-router（前端路由）](https://router.vuejs.org/zh/)
- [vuex（数据状态管理）](https://vuex.vuejs.org/zh/)
- [axios（网络访问）](https://www.kancloud.cn/yunye/axios/234845)
- [mockjs（数据模拟）](http://mockjs.com/)
- [vue-i18n（国际化）](https://kazupon.github.io/vue-i18n/guide/formatting.html)
- [ant-design（设计原则）](https://ant.design/docs/spec/introduce-cn)
- [lokijs（前端数据库）](https://rawgit.com/techfort/LokiJS/master/jsdoc/index.html)
- [moment（时间格式化）](http://momentjs.cn/)

## Build Setup

``` bash
# 安装依赖
npm i // npm install

# 启动特定项目
npm run dev --project=qis
npm run dev --project=portal

# 以联调模式启动特定项目
npm run dev --project=qis --test
npm run dev --project=portal --test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## TODO

### 路由菜单

传统的路由菜单中，都是项目发布上线之后进行在线配置，将客户端上的模块写入到数据库中，这个过程中难免会有错误。
vsee框架在第一次打开项目的时候，自动显示当前项目的所有路由列表，方便开发人员直接配置，由于资源的名称是唯一的，因此可以和服务端保持统一；
