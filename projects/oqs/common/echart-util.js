import { curry } from 'ramda';
/**
 * 服务断数据结构
 * ['a', 'b', 'c', 'd', 'e', ...]
 * [a1,  b1,  c1,  d1,  e1,  ...]
 * [a2,  b2,  c2,  d2,  e2,  ...]
 * [a3,  b3,  c3,  d3,  e3,  ...]
 * 通过数据提取，转换为echarts可用source结构
 * @param Object config - 转换配置
 * {
 *    reverse:  // 反转矩阵，默认`false`；
 *    series:   // 序列下标或名称，默认`0`；
 *    xAxis:    // `x轴`下标或名称，默认`0`；
 *    yAxis:    // `y轴`下标或名称，默认`0`；
 *    title:    // 数据源的标题，即`source[0][0]`的值，默认`'-'`；
 *    unhead:   // 是否无头数据，即表头，默认`false`表示有表头；
 * }
 * @param Array list - 转换的数组（二维数组）
 */
export const list2echartSource = curry((config, list = []) => {
  const { reverse = false, unhead = false } = config;
  const names = list[0] || [];
  let { series = 0, xAxis = 0, yAxis = 0 } = config;
  if (typeof series === 'string' && names.includes(series)) {
    series = [names.indexOf(series)];
  } else if (series instanceof Array) {
    series = series.map((item) => (typeof item === 'string' ? names.indexOf(item) : item));
  } else if (typeof series !== 'number') {
    throw new Error('series未能成功匹配到');
  }
  if (typeof xAxis === 'string' && names.includes(xAxis)) {
    xAxis = names.indexOf(xAxis);
  } else if (typeof xAxis !== 'number') {
    throw new Error('xAxis未能成功匹配到');
  }
  if (typeof yAxis === 'string' && names.includes(yAxis)) {
    yAxis = names.indexOf(yAxis);
  } else if (typeof yAxis !== 'number') {
    throw new Error('yAxis未能成功匹配到');
  }
  const result = list.reduce(({ ln, l0 }, row, index, { length }) => {
    if (index || unhead) {
      const cs = series.map((y) => (row[y] === void 0 ? null : row[y]));
      let cx = reverse ? row[xAxis] : row[yAxis];
      cx = cx === void 0 ? null : cx;
      let cy = reverse ? row[yAxis] : row[xAxis];
      cy = cy === void 0 ? null : cy;
      if (Object.hasOwnProperty.call(ln, cy)) {
        ln[cy].push(...cs);
      } else {
        ln[cy] = [cy, ...cs];
      }
      if (!l0.includes(cx)) {
        series.forEach(() => l0.push(cx));
      }
    }
    return index === length - 1 ? [l0, ...Object.values(ln)] : { ln, l0 };
  }, { ln: {}, l0: [config.title || '-'] });
  return result;
});

export default {};
