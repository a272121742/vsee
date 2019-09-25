// const PREVENT_TWICE_EVENT = '__prevent_twice_event__';
// const button = { flag: false, click: e => e };

export default {
  props: {
    bind: {
      type: String,
      default: '',
      validator (value) {
        return ~['', 'disabled', 'loading', 'both'].indexOf(value);
      }
    }
  },
  data () {
    return {
      button: { flag: false, click: e => e },
      loading: false,
      disabled: false
    }
  },
  beforeCreate () {
    this.$listeners.click && (this.button.click = this.$listeners.click);
    this.$delete(this.$listeners, 'click');
  },
  created () {
    if (this.bind) {
      if (this.bind === 'both') {
        this.loading = this.$attrs.loading;
        this.disabled = this.$attrs.disabled;
      } else {
        this.$set(this, this.bind, this.$attrs[this.bind]);
      }
    }
  },
  methods: {
    handleClick (e) {
      if (!this.button.flag) {
        this.button.flag = true;
        this.button.click(e);
        this.bindAttrChange();
      } else {
        this.$message.info(this.$t('message'));
      }
    },
    bindAttrChange () {
      switch (this.bind) {
      case 'loading':
        this.loading = this.button.flag;
        break;
      case 'disabled':
        this.disabled = this.button.flag;
        break;
      case 'both':
        this.loading = this.disabled = this.button.flag;
        break;
      default:
        break;
      }
    },
    reset () {
      if (this.button.flag) {
        this.button.flag = false;
        this.bindAttrChange();
      }
    }
  }
};
