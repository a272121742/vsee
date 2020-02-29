export default {
  data () {
    return {
      locale: {
        zh: {
          lang: 'zh',
          text: '中文',
          title: '中',
          name: 'zh-CN',
        },
        en: {
          lang: 'en',
          text: 'EN',
          title: 'en',
          name: 'en-US',
        },
      },
      langs: [{
        lang: 'zh',
        text: '中文',
        title: '中',
        name: 'zh-CN',
      }, {
        lang: 'en',
        text: 'EN',
        title: 'en',
        name: 'en-US',
      }],
    };
  },
  computed: {
    lang () {
      return this.langs.find((item) => item.lang === this.$i18n.locale).title;
    },
  },
  methods: {
    changeLanguage ({ key }, { name }) {
      // 变更i18n的国际化
      this.$i18n && (this.$i18n.locale = key);
      // 调用统一接口设置语言
      this.$store.dispatch('loadLanguage', name);
    },
  },
};
