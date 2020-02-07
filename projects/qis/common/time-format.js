import moment from 'moment';
// 全局日期选择
const GLOBAL_SELECT_DATE_FORMAT = 'YYYY-MM-DD';
// 全局时间选择
const GLOBAL_SELECT_TIME_FORMAT = 'HH:mm:ss';
// 全局操作日期展示
const ACTION_LABEL_DATE_FORMAT = `${GLOBAL_SELECT_DATE_FORMAT} ${GLOBAL_SELECT_TIME_FORMAT}`;
// 日期范围
const DATA_RANGE = {
  BEGIN_DAY_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} 00:00:00`,
  END_DAY_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} 23:59:59`,
  BEGIN_HOUR_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} HH:00:00`,
  END_HOUR_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} HH:59:59`,
  BEGIN_MINUTE_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} HH:mm:00`,
  END_MINUTE_FORMAT: `${GLOBAL_SELECT_DATE_FORMAT} HH:mm:59`,
};

export default {
  data () {
    return {
      GLOBAL_SELECT_DATE_FORMAT,
      GLOBAL_SELECT_TIME_FORMAT,
      ACTION_LABEL_DATE_FORMAT,
      DATA_RANGE,
    };
  },
  filters: {
    GLOBAL_SELECT_DATE_FORMAT (value) {
      if (value) {
        const m = moment(value);
        return m.isValid ? m.format(GLOBAL_SELECT_DATE_FORMAT) : '-';
      }
      return '-';
    },
  },
};
