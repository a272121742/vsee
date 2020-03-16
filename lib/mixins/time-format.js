import moment from 'moment';
import config from '~/config.js';

const {
  DATE_FORMAT = 'YYYY-MM-DD',
  TEIME_FORMAT = 'HH:mm:ss',
  DATETIME_FORMAT = `${DATE_FORMAT} ${TEIME_FORMAT}`,
  EMPTY_DATETIME = '-',
} = config;

// 全局日期选择
const GLOBAL_SELECT_DATE_FORMAT = DATE_FORMAT;
// 全局时间选择
const GLOBAL_SELECT_TIME_FORMAT = TEIME_FORMAT;
// 全局操作日期展示
const ACTION_LABEL_DATE_FORMAT = DATETIME_FORMAT;
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
      ...DATA_RANGE,
    };
  },
  filters: {
    FORMAT (value, formatStr) {
      if (value) {
        const m = moment(value);
        return m.isValid ? m.format(formatStr) : EMPTY_DATETIME;
      }
      return EMPTY_DATETIME;
    },
    GLOBAL_SELECT_DATE_FORMAT (value) {
      if (value) {
        const m = moment(value);
        return m.isValid ? m.format(GLOBAL_SELECT_DATE_FORMAT) : EMPTY_DATETIME;
      }
      return EMPTY_DATETIME;
    },
  },
  methods: {
    transformMomentDate (record = {}, field) {
      const start = `${field}Start`;
      const end = `${field}End`;
      const startValue = record[field] ? (record[field][0] ? record[field][0] : null) : null;
      const endValue = record[field] ? (record[field][1] ? record[field][1] : null) : null;
      record[start] = startValue ? startValue.format(this.BEGIN_DAY_FORMAT) : null;
      record[end] = endValue ? endValue.format(this.END_DAY_FORMAT) : null;
    },
  },
};
