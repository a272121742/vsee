import {
  map, memoizeWith, identity, is, each,
} from 'ramda';
import { isNaN } from 'lodash';

const isString = is(String);
const memoize = memoizeWith(identity);

const RGB_REG = /rgba?\(([\s.,0-9]+)\)/;
const regexLG = /^l\s*\(\s*([\d.]+)\s*\)\s*(.*)/i;
const regexRG = /^r\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)\s*(.*)/i;
const regexColorStop = /[\d.]+:(#[^\s]+|[^\)]+\))/gi;

const isGradientColor = (val) => /^[r,R,L,l]{1}[\s]*\(/.test(val);

// 创建辅助 tag 取颜色
const createTmp = () => {
  const i = document.createElement('i');
  i.title = 'Web Colour Picker';
  i.style.display = 'none';
  document.body.appendChild(i);
  return i;
};

// 获取颜色之间的插值
const getValue = (start = [], end = [], percent = 0, index = 0) => start[index] + (end[index] - start[index]) * percent;

// rgb 颜色转换成数组
const rgb2arr = (str) => [
  parseInt(str.substr(1, 2), 16),
  parseInt(str.substr(3, 2), 16),
  parseInt(str.substr(5, 2), 16),
];

// 将数值从 0-255 转换成16进制字符串
const toHex = (value) => {
  const x16Value = Math.round(value).toString(16);

  return x16Value.length === 1 ? `0${x16Value}` : x16Value;
};

// 数组转换成颜色
const arr2rgb = (arr = []) => `#${toHex(arr[0])}${toHex(arr[1])}${toHex(arr[2])}`;

// 计算颜色
const calColor = (points = [[]], percent = 0) => {
  const fixedPercent = isNaN(Number(percent)) || percent < 0 ? 0
    : percent > 1 ? 1
      : Number(percent);

  const steps = points.length - 1;

  const step = Math.floor(steps * fixedPercent);

  const left = steps * fixedPercent - step;

  const start = points[step];

  const end = step === steps ? start : points[step + 1];

  return arr2rgb([
    getValue(start, end, left, 0),
    getValue(start, end, left, 1),
    getValue(start, end, left, 2),
  ]);
};

// 用于给 toRGB 的缓存（使用 memoize 方法替换）
// const colorCache = {};
let iEl;

/**
 * 将颜色转换到 rgb 的格式
 * @param {color} color 颜色
 * @return 将颜色转换到 '#ffffff' 的格式
 */
const toRGB = (color) => {
  // 如果已经是 rgb的格式
  if (color[0] === '#' && color.length === 7) {
    return color;
  }

  if (!iEl) {
    // 防止防止在页头报错
    iEl = createTmp();
  }

  iEl.style.color = color;

  let rst = document.defaultView.getComputedStyle(iEl, '').getPropertyValue('color');

  const matches = RGB_REG.exec(rst);
  const cArray = matches[1].split(/\s*,\s*/).map((s) => Number(s));

  rst = arr2rgb(cArray);

  return rst;
};

/**
 * 获取渐变函数
 * @param colors 多个颜色
 * @return 颜色值
 */
const gradient = (colors = []) => {
  const colorArray = isString(colors) ? colors.split('-') : colors;

  const points = map((color) => rgb2arr(color.indexOf('#') === -1 ? toRGB(color) : color), colorArray);

  // 返回一个函数
  return (percent) => calColor(points, percent);
};

const toCSSGradient = (gradientColor) => {
  if (isGradientColor(gradientColor)) {
    let cssColor;
    let steps;
    if (gradientColor[0] === 'l') {
      // 线性渐变
      const arr = regexLG.exec(gradientColor);
      const angle = +arr[1] + 90; // css 和 g 的渐变起始角度不同
      steps = arr[2];

      cssColor = `linear-gradient(${angle}deg, `;
    } else if (gradientColor[0] === 'r') {
      // 径向渐变
      cssColor = 'radial-gradient(';
      const arr = regexRG.exec(gradientColor);
      steps = arr[4];
    }

    const colorStops = steps.match(regexColorStop);
    each(colorStops, (item, index) => {
      const itemArr = item.split(':');
      cssColor += `${itemArr[1]} ${itemArr[0] * 100}%`;
      if (index !== (colorStops.length - 1)) {
        cssColor += ', ';
      }
    });

    cssColor += ')';

    return cssColor;
  }

  return gradientColor;
};

export default {
  rgb2arr,
  gradient,
  toRGB: memoize(toRGB),
  toCSSGradient,
};
