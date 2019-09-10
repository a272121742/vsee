import Cookies from 'js-cookie';
export default {
  data () {
    return {
      locale: {
        zh: {
          lang: 'zh',
          text: '中文',
          title: '中',
          name: 'zh_CN'
        },
        en: {
          lang: 'en',
          text: 'EN',
          title: 'en',
          name: 'en_GB'
        }
      },
      langs: [{
        lang: 'zh',
        text: '中文',
        title: '中',
        name: 'zh_CN'
      }, {
        lang: 'en',
        text: 'EN',
        title: 'en',
        name: 'en_GB'
      }]
    }
  },
  computed: {
    lang () {
      return this.langs.find(item => item.lang === this.$i18n.locale).title;
    }
  },
  methods: {
    changeLanguage ({ key }, { name }) {
      // 变更i18n的国际化
      this.$i18n && (this.$i18n.locale = key);
      // 变更ant-design UI组件的国际化
      import('ant-design-vue/lib/locale-provider/' + name).then(res => {
        this.$root && this.$root.locale && (this.$root.locale = res.default);
        Cookies.set('locale', name);
      });
    }
  }
}
