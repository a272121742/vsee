import tinycolor from 'tinycolor2';
// 原来`color-helper.js`函数部分（起始部分）
import { is } from 'ramda';
import { isNaN } from 'lodash';

const isString = is(String);

// 获取颜色之间的插值
const getInterpolationValue = (start = [], end = [], percent = 0, index = 0) => start[index] + (end[index] - start[index]) * percent;

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
  const color = tinycolor({
    r: getInterpolationValue(start, end, left, 0),
    g: getInterpolationValue(start, end, left, 1),
    b: getInterpolationValue(start, end, left, 2),
  });
  return color.toHexString();
};

/**
 * 获取渐变函数
 * @param colors 多个颜色
 * @return 颜色值
 */
const gradient = (colors = []) => {
  const colorArray = isString(colors) ? colors.split('-') : colors;
  const points = colorArray.map((color) => {
    const {
      r, g, b, a,
    } = tinycolor(color).toRgb();
    return [
      (255 - r) * (1 - a) + r,
      (255 - g) * (1 - a) + g,
      (255 - b) * (1 - a) + b,
    ];
  });
  // 返回一个函数
  return (percent) => calColor(points, percent);
};

// 原来`colorhelper`函数部分（就结束部分）

const hueStep = 2; // 色相阶梯
const saturationStep = 0.16; // 饱和度阶梯，浅色部分
const saturationStep2 = 0.05; // 饱和度阶梯，深色部分
const brightnessStep1 = 0.05; // 亮度阶梯，浅色部分
const brightnessStep2 = 0.15; // 亮度阶梯，深色部分
const lightColorCount = 5; // 浅色数量，主色上
const darkColorCount = 4; // 深色数量，主色下
// 暗色主题颜色映射关系表
const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 4, opacity: 0.9 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 },
];
function getHue (hsv, i, light) {
  let hue;
  // 根据色相不同，色相转向不同
  if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
    hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
  } else {
    hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
  }
  if (hue < 0) {
    hue += 360;
  } else if (hue >= 360) {
    hue -= 360;
  }
  return hue;
}
function getSaturation (hsv, i, light) {
  // grey color don't change saturation
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }
  let saturation;
  if (light) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }
  // 边界值修正
  if (saturation > 1) {
    saturation = 1;
  }
  // 第一格的 s 限制在 0.06-0.1 之间
  if (light && i === lightColorCount && saturation > 0.1) {
    saturation = 0.1;
  }
  if (saturation < 0.06) {
    saturation = 0.06;
  }
  return Number(saturation.toFixed(2));
}
function getValue (hsv, i, light) {
  let value;
  if (light) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }
  if (value > 1) {
    value = 1;
  }
  return Number(value.toFixed(2));
}
function generate (color, opts = {}) {
  const patterns = [];
  const pColor = tinycolor(color);
  for (let i = lightColorCount; i > 0; i -= 1) {
    const hsv = pColor.toHsv();
    const colorString = tinycolor({
      h: getHue(hsv, i, true),
      s: getSaturation(hsv, i, true),
      v: getValue(hsv, i, true),
    }).toHexString();
    patterns.push(colorString);
  }
  patterns.push(pColor.toHexString());
  for (let i = 1; i <= darkColorCount; i += 1) {
    const hsv = pColor.toHsv();
    const colorString = tinycolor({
      h: getHue(hsv, i),
      s: getSaturation(hsv, i),
      v: getValue(hsv, i),
    }).toHexString();
    patterns.push(colorString);
  }
  // dark theme patterns
  if (opts.theme === 'dark') {
    return darkColorMap.map(({ index, opacity }) => {
      const darkColorString = tinycolor
        .mix(opts.backgroundColor || '#141414', patterns[index], opacity * 100)
        .toHexString();
      return darkColorString;
    });
  }
  return patterns;
}

const defaultLevel = 6;
function colorPalette (color, level = defaultLevel, opts = {}) {
  const colors = generate(color, opts);
  return colors[level - 1] || color[defaultLevel - 1];
}

function color2rgb (source, bg = '#FFFFFF') {
  const target = {};
  const sourceRgba = tinycolor(source).toRgb();
  const bgRgba = tinycolor(bg).toRgb();
  target.r = ((1 - sourceRgba.a) * bgRgba.r) + (sourceRgba.a * sourceRgba.r);
  target.g = ((1 - sourceRgba.a) * bgRgba.g) + (sourceRgba.a * sourceRgba.g);
  target.b = ((1 - sourceRgba.a) * bgRgba.b) + (sourceRgba.a * sourceRgba.b);
  return tinycolor(target).toRgbString();
}

function color2rgba (source) {
  const sourceRgba = tinycolor(source).toRgb();
  if (sourceRgba.a > 0) {
    const { r, g, b } = sourceRgba;
    const a = 1 - Math.min(r, g, b) / 255;
    return tinycolor({
      r: 255 + (r - 255) / a,
      g: 255 + (g - 255) / a,
      b: 255 + (b - 255) / a,
      a,
    }).toRgbString();
  }
  return 'rgba(255, 255, 255, 0)';
}

const fade = (color, opacity) => {
  const beforeColor = tinycolor(color);
  if (opacity || (opacity >= 0 && opacity <= 1)) {
    const opacityNumber = parseFloat(opacity) || 0;
    const alpha = opacityNumber > 1 ? 1 : (opacityNumber < 0 ? 0 : opacityNumber);
    beforeColor.setAlpha(alpha);
  }
  return beforeColor.toRgbString();
};

export default {
  generate,
  colorPalette,
  color2rgb,
  color2rgba,
  gradient,
  fade,
};
