const PREVENT_TWICE_EVENT = '__prevent_twice_event__';
const button = { flag: false, click: e => e };

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
      loading: false,
      disabled: false
    }
  },
  beforeCreate () {
    button.click = this.$listeners.click || button.click;
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
      if (!button.flag) {
        button.flag = true;
        button.click(e);
        this.bindAttrChange();
      } else {
        this.$message.info(this.$t('message'));
      }
    },
    bindAttrChange () {
      switch (this.bind)  {
      case 'loading' :
        this.loading = button.flag;
        break;
      case 'disabled' :
        this.disabled = button.flag;
        break;
      case 'both' :
        this.loading = this.disabled = button.flag;
        break;
      default:
        break;
      }
    },
    reset () {
      if(button.flag) {
        button.flag = false;
        this.bindAttrChange();
      }
    }
  },
};