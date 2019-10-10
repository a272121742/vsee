import moment from 'moment';
// 全局日期选择
const GLOBAL_SELECT_DATE_FORMAT = 'YYYY/MM/DD';
// 全局操作日期展示
const ACTION_LABEL_DATE_FORMAT = 'YYYY/MM/DD HH:mm:ss';

export default {
  data () {
    return {
      GLOBAL_SELECT_DATE_FORMAT,
      ACTION_LABEL_DATE_FORMAT
    };
  },
  filters: {
    GLOBAL_SELECT_DATE_FORMAT (value) {
      if (value) {
        const m = moment(value);
        return m.isValid ? m.format(GLOBAL_SELECT_DATE_FORMAT) : '-';
      }
      return '-';
    }
  }
};
