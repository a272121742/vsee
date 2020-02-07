/**
 * 国际化助理（PrimaryTag-SubTag模式）
 */
// 默认格式必须是`zh-CN`格式，启动项有校验
import { LANGUAGE_DEFAULT } from '~/config.js';


const _String = '';
// 短横杆
const KEBAB = '-';
// 下划线
const UNDERLINE = '_';


// zh-CN默认值
const DEFAULT_LANGUAGE_TYPEOF_KEBAR = LANGUAGE_DEFAULT;
// zh_CN默认值
const DEFAULT_LANGUAGE_TYPEOF_UNDERLINE = LANGUAGE_DEFAULT.split(KEBAB).join(UNDERLINE);

export const isKebab = (lan) => /[a-z]{2}-[A-Z]{2}/.test(lan);
export const isUnderline = (lan) => /[a-z]{2}_[A-Z]{2}/.test(lan);
// 转换为`zh-CN`模式
export const toKebab = (lang = DEFAULT_LANGUAGE_TYPEOF_UNDERLINE) => (isUnderline(lang) ? lang.split(UNDERLINE).join(KEBAB) : DEFAULT_LANGUAGE_TYPEOF_KEBAR);
// 转换为`zh_CN`模式
export const toUnderline = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => (isKebab(lang) ? lang.split(KEBAB).join(UNDERLINE) : DEFAULT_LANGUAGE_TYPEOF_UNDERLINE);
// 转换为moment可用国际化格式`zh-cn`
export const toMoment = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => _String.toLocaleLowerCase.call(isKebab(lang) ? lang : DEFAULT_LANGUAGE_TYPEOF_KEBAR);
// 转化为`antd`可用国际化格式`ant-design-vue/lib/locale-provider/zh_CN`
export const toAntD = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => toUnderline(isKebab(lang) ? lang : DEFAULT_LANGUAGE_TYPEOF_KEBAR);

export const getPrimaryTag = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => _String.split.call(isKebab(lang) ? lang : DEFAULT_LANGUAGE_TYPEOF_KEBAR, KEBAB)[0];
export const getSubTag = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => _String.split.call(isKebab(lang) ? lang : DEFAULT_LANGUAGE_TYPEOF_KEBAR, KEBAB)[1];

export const transLanguage = (lang = DEFAULT_LANGUAGE_TYPEOF_KEBAR) => (isKebab(lang) ? lang : DEFAULT_LANGUAGE_TYPEOF_KEBAR);
