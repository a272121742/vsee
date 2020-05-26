import { pipe, useWith, defaultTo } from 'ramda';
import moment from 'moment';
import config from '~/config.js';

const { DATETIME = {} } = config;

const {
  DATE_FORMAT = 'YYYY-MM-DD',
  TIME_FORMAT = 'HH:mm:ss',
  EMPTY_DATETIME_FORMAT = '-',
  START_FIELDNAME = (fieldname) => `${fieldname}Start`,
  END_FIELDNAME = (fieldname) => `${fieldname}End`,
} = DATETIME;

const EMPTY_DATETIME_VALUE = [void 0, null, ''].includes(DATETIME.EMPTY_DATETIME_VALUE) ? DATETIME.EMPTY_DATETIME_VALUE : null;

if (!(START_FIELDNAME instanceof Function)) {
  throw new Error('配置错误：`DATETIME.START_FIELDNAME`必须是个函数');
}
if (!(END_FIELDNAME instanceof Function)) {
  throw new Error('配置错误：`DATETIME.END_FIELDNAME`必须是个函数');
}

export {
  DATE_FORMAT,
  TIME_FORMAT,
  EMPTY_DATETIME_FORMAT,
  EMPTY_DATETIME_VALUE,
  START_FIELDNAME,
  END_FIELDNAME,
};

export const DATETIME_FORMAT = DATETIME.DATETIME_FORMAT ? (
  DATETIME.DATETIME_FORMAT instanceof Function ? DATETIME.DATETIME_FORMAT(DATE_FORMAT, TIME_FORMAT) : DATETIME.DATETIME_FORMAT
) : `${DATE_FORMAT} ${TIME_FORMAT}`;

export const GET_MOMENT = (value) => {
  const result = moment(value);
  const isValid = value && result.isValid;
  return isValid ? result : EMPTY_DATETIME_VALUE;
};
const GET_DATETIME_BY_FORMAT = (format) => (value) => {
  const result = moment(value);
  const isValid = value && result.isValid;
  return isValid ? result.format(format) : EMPTY_DATETIME_VALUE;
};

export const GET_DATE_FORMAT = GET_DATETIME_BY_FORMAT(DATE_FORMAT);
export const GET_TIME_FORMAT = GET_DATETIME_BY_FORMAT(TIME_FORMAT);
export const GET_DATETIME_FORMAT = GET_DATETIME_BY_FORMAT(DATETIME_FORMAT);

const RANGE_OF = (isBegin = true) => (type = 'day') => (_moment) => (moment.isMoment(_moment) ? _moment[isBegin ? 'startOf' : 'endOf'](type) : EMPTY_DATETIME_VALUE);
const START_OF = RANGE_OF();
const END_OF = RANGE_OF(false);

const STSRT_OF_DAY = START_OF('day');
const END_OF_DAY = END_OF('day');
const START_OF_WEEK = START_OF('week');
const END_OF_WEEK = END_OF('week');
const START_OF_MONTH = START_OF('month');
const END_OF_MONTH = END_OF('month');
const START_OF_YEAR = START_OF('year');
const END_OF_YEAR = END_OF('year');

export const GET_START_OF_DAY = pipe(GET_MOMENT, STSRT_OF_DAY, GET_DATETIME_FORMAT);
export const GET_END_OF_DAY = pipe(GET_MOMENT, END_OF_DAY, GET_DATETIME_FORMAT);
export const GET_START_OF_WEEK = pipe(GET_MOMENT, START_OF_WEEK, GET_DATETIME_FORMAT);
export const GET_END_OF_WEEK = pipe(GET_MOMENT, END_OF_WEEK, GET_DATETIME_FORMAT);
export const GET_START_OF_MONTH = pipe(GET_MOMENT, START_OF_MONTH, GET_DATETIME_FORMAT);
export const GET_END_OF_MOMENT = pipe(GET_MOMENT, END_OF_MONTH, GET_DATETIME_FORMAT);
export const GET_START_OF_YEAR = pipe(GET_MOMENT, START_OF_YEAR, GET_DATETIME_FORMAT);
export const GET_END_OF_YEAR = pipe(GET_MOMENT, END_OF_YEAR, GET_DATETIME_FORMAT);

export const DAY_RANGE = (begin = moment(), end = moment()) => useWith(Array, [GET_START_OF_DAY, GET_END_OF_DAY])(begin, end);
export const WEEK_RANGE = (begin = moment(), end = moment()) => useWith(Array, [GET_START_OF_WEEK, GET_END_OF_WEEK])(begin, end);
export const MONTH_RANGE = (begin = moment(), end = moment()) => useWith(Array, [GET_START_OF_MONTH, GET_END_OF_MOMENT])(begin, end);
export const YEAR_RANGE = (begin = moment(), end = moment()) => useWith(Array, [GET_START_OF_YEAR, GET_END_OF_YEAR])(begin, end);

export const RANGE_TO_MAP = (field) => (begin = EMPTY_DATETIME_VALUE, end = EMPTY_DATETIME_VALUE) => ({
  [START_FIELDNAME(field)]: begin,
  [END_FIELDNAME(field)]: end,
});
export const MAP_TO_RANGE = (field) => (json) => [json[START_FIELDNAME(field)], json[END_FIELDNAME(field)]];
export const RANGE_TO_MAP_BY_FIELD = (record = {}, field, type = 'day') => {
  const start = START_FIELDNAME(field);
  const end = END_FIELDNAME(field);
  const [startValue, endValue] = record[field] || [];
  record[start] = pipe(START_OF(type), GET_DATETIME_FORMAT)(startValue);
  record[end] = pipe(END_OF(type), GET_DATETIME_FORMAT)(endValue);
};
export const MAP_TO_RANGE_BY_FIELD = (record = {}, field) => {
  const start = record[START_FIELDNAME(field)];
  const end = record[END_FIELDNAME(field)];
  record[field] = useWith(Array, [GET_MOMENT, GET_MOMENT])(start, end);
};

// console.log(moment);
// console.log('日期格式化', DATE_FORMAT);
// console.log('时间格式化', TIME_FORMAT);
// console.log('时间日期格式化', DATETIME_FORMAT);
// console.log('空时间', EMPTY_DATETIME_FORMAT);

// console.log('范围天', DAY_RANGE(moment(), moment()));
// console.log('范围周', WEEK_RANGE(moment(), moment()));
// console.log('范围月', MONTG_RANGE(moment(), moment()));
// console.log('范围年', YEAR_RANGE(moment()));

// console.log('范围map', RANGE_MAP('create')(...YEAR_RANGE(moment())));
const EMPTY_FORMAT_DATETIME = defaultTo(EMPTY_DATETIME_FORMAT);

export default {
  install (Vue) {
    Vue.filter('DATE_FORMAT', pipe(GET_DATETIME_BY_FORMAT(DATE_FORMAT), EMPTY_FORMAT_DATETIME));
    Vue.filter('TIME_FORMAT', pipe(GET_DATETIME_BY_FORMAT(TIME_FORMAT), EMPTY_FORMAT_DATETIME));
    Vue.filter('DATETIME_FORMAT', pipe(GET_DATETIME_BY_FORMAT(DATETIME_FORMAT), EMPTY_FORMAT_DATETIME));
    Vue.prototype.DATE_FORMAT = DATE_FORMAT;
    Vue.prototype.TIME_FORMAT = TIME_FORMAT;
    Vue.prototype.DATETIME_FORMAT = DATETIME_FORMAT;
  },
};
