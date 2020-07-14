import Vue from 'vue';
import config from '~/config.js';

const { WATER_MARK = {} } = config;

if (WATER_MARK.enable === true) {
  Vue.directive('water-mark', {
    bind (el, binding, vnode) {
      const { value, arg: type = 'canvas' } = binding;
      const options = {
        width: 240,
        height: 135,
        fontSize: 14,
        fontFamily: 'Arial',
        fontWeight: 400,
        color: 'rgba(0, 0, 0, 0.24)',
        rotate: -15,
        zIndex: 5,
        ...WATER_MARK,
        ...value,
      };
      if (vnode.componentInstance) {
        vnode.componentInstance.$nextTick(() => {
          options.el = document.querySelector(options.el);
          renderWaterMark(type, { container: options.el || el || document.body, ...options });
        });
      } else {
        Vue.nextTick(() => {
          options.el = document.querySelector(options.el);
          renderWaterMark(type, { container: options.el || el || document.body, ...options });
        });
      }
    },
  });
}

function renderWaterMark (type, args) {
  const {
    container = document.body,
    width = 240, height = 135,
    // fontSize = 14,
    // fontFamily = 'Arial',
    // fontWeight = 400,
    // color = 'rgba(0, 0, 0, 0.24)',
    // content = '请勿外传',
    // rotate = -15,
    zIndex = 1,
  } = args;
  const widthParse = parseSize(width);
  const heightParse = parseSize(height);
  const result = { isDom: type === 'dom' };

  switch (type) {
  case 'dom':
    result.render = getDomRender(args);
    break;
  case 'svg':
    result.url = getSvg(args);
    break;
  case 'canvas':
  default:
    result.url = getCanvas(args);
    break;
  }
  const __wm = container.querySelector('.__wm');
  const watermarkDiv = __wm || document.createElement('div');
  const { clientWidth, clientHeight } = container;
  const cols = Math.ceil(clientWidth / widthParse.value);
  const rows = Math.ceil(clientHeight / heightParse.value);
  const styleStr = result.isDom ? `
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-wrap: wrap;
    width: ${Math.max(clientWidth, widthParse.value * cols)}px;
    height: ${Math.min(clientHeight, heightParse.value * rows)}px;
    z-index: ${zIndex};
    overflow: hidden;
    user-select: none;
    pointer-events: none;
  ` : `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: ${zIndex};
    pointer-events: none;
    background-repeat: repeat;
    background-image: url('${result.url}')
  `;
  if (result.isDom) {
    for (let i = 0; i < cols * rows; i += 1) {
      watermarkDiv.appendChild(result.render());
    }
  }
  watermarkDiv.setAttribute('style', styleStr);
  watermarkDiv.classList.add('__wm');

  if (!__wm) {
    container.style.position = 'relative';
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
  if (MutationObserver) {
    let mo = new MutationObserver((() => {
      const __wm__ = document.querySelector('.__wm');
      if ((__wm__ && __wm__.getAttribute('style') !== styleStr) || !__wm__) {
        mo.disconnect();
        mo = null;
        renderWaterMark(args);
      }
    }));

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}

function parseSize (size) {
  if (typeof size === 'number') {
    return { value: size, text: `${size}px` };
  }
  if (typeof size === 'string') {
    if (/^\d+%$/.test(size)) {
      return { value: size, text: size };
    }
    const value = parseFloat(size);
    if (![NaN].includes(value)) {
      return { value, text: size };
    }
  }
  return { value: 0, text: '100%' };
}

function getCanvas ({
  width = 240, height = 135,
  fontSize = 14,
  fontFamily = 'Arial',
  fontWeight = 400,
  color = 'rgba(0, 0, 0, 0.24)',
  content = '请勿外传',
  rotate = -15,
} = {}) {
  const widthParse = parseSize(width);
  const heightParse = parseSize(height);
  const fontSizeParse = parseSize(fontSize);
  const canvas = document.createElement('canvas');
  canvas.setAttribute('width', widthParse.text);
  canvas.setAttribute('height', heightParse.text);
  const ctx = canvas.getContext('2d');

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.translate(widthParse.value * 0.5, heightParse.value * 0.5);
  ctx.rotate(rotate * (Math.PI / 180));
  ctx.fillText(content, 0, fontSizeParse.value * 0.5);

  return canvas.toDataURL();
}

function getSvg ({
  width = 240, height = 135,
  fontSize = 14,
  fontFamily = 'Arial',
  fontWeight = 400,
  color = 'rgba(0, 0, 0, 0.24)',
  content = '请勿外传',
  rotate = -15,
} = {}) {
  const widthParse = parseSize(width);
  const heightParse = parseSize(height);
  const fontSizeParse = parseSize(fontSize);
  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthParse.value} ${heightParse.value}" width="${widthParse.text}" height="${heightParse.text}">
      <text 
        x="50%"
        y="50%"
        dy="${fontSizeParse.text}"
        text-anchor="middle"
        dominant-baseline="middle"
        font-size="${fontSizeParse.text}"
        font-family="${fontFamily}"
        font-weight="${fontWeight}"
        fill="${color}"
        transform="rotate(${rotate}, ${widthParse.value / 2} ${heightParse.value / 2})"
      >
        ${content}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
}

function getDomRender ({
  width = 240, height = 135,
  fontSize = 14,
  fontFamily = 'Arial',
  fontWeight = 400,
  color = 'rgba(0, 0, 0, 0.24)',
  content = '请勿外传',
  rotate = -15,
} = {}) {
  const widthParse = parseSize(width);
  const heightParse = parseSize(height);
  const fontSizeParse = parseSize(fontSize);
  return function createItem () {
    const div = document.createElement('div');
    div.setAttribute('style', `
      position: relative;
      flex: 0 0 ${widthParse.text};
      width: ${widthParse.text};
      height: ${heightParse.text};
      overflow: hidden;
      user-select: none;
      pointer-events: none;
    `);
    const span = document.createElement('span');
    span.setAttribute('style', `
      position: absolute;
      top: 50%;
      left: 50%;
      font-family: ${fontFamily};
      font-size: ${fontSizeParse.text};
      font-weight: ${fontWeight};
      color: ${color};
      transform: rotate(${rotate}deg) translate(-50%, -50%);
      overflow: hidden;
      white-space: nowrap;
      user-select: none;
      pointer-events: none;
    `);
    span.innerHTML = content;
    div.appendChild(span);
    return div;
  };
}

/**
 * 网页加水印（Canvas版）
 */
// function canvasWM (args) {
//   const {
//     // 使用 ES6 的函数默认值方式设置参数的默认取值
//     // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
//     container = document.body,
//     width = 240, height = 135,
//     fontSize = 14,
//     fontFamily = 'Arial',
//     fontWeight = 400,
//     color = 'rgba(0, 0, 0, 0.24)',
//     content = '请勿外传',
//     rotate = -15,
//     zIndex = 1,
//   } = args;
//   const widthNumber = parseInt(width, 10);
//   const heightNumber = parseInt(height, 10);
//   const fontSizeNumber = parseInt(fontSize, 10);

//   const canvas = document.createElement('canvas');

//   canvas.setAttribute('width', width);
//   canvas.setAttribute('height', height);
//   const ctx = canvas.getContext('2d');

//   ctx.textAlign = 'center';
//   ctx.textBaseline = 'middle';
//   ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
//   ctx.fillStyle = color;
//   ctx.translate(widthNumber * 0.5, heightNumber * 0.5);
//   ctx.rotate(rotate * (Math.PI / 180));
//   ctx.fillText(content, 0, fontSizeNumber * 0.5);

//   const base64Url = canvas.toDataURL();
//   const __wm = document.querySelector('.__wm');

//   const watermarkDiv = __wm || document.createElement('div');
//   const styleStr = `
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: ${zIndex};
//     pointer-events: none;
//     background-repeat: repeat;
//     background-image: url('${base64Url}')`;

//   watermarkDiv.setAttribute('style', styleStr);
//   watermarkDiv.classList.add('__wm');

//   if (!__wm) {
//     container.style.position = 'relative';
//     container.insertBefore(watermarkDiv, container.firstChild);
//   }

//   const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//   if (MutationObserver) {
//     let mo = new MutationObserver((() => {
//       const __wm__ = document.querySelector('.__wm');
//       // 只在__wm元素变动才重新调用 __canvasWM
//       if ((__wm__ && __wm__.getAttribute('style') !== styleStr) || !__wm__) {
//         // 避免一直触发
//         mo.disconnect();
//         mo = null;
//         canvasWM(JSON.parse(JSON.stringify(args)));
//       }
//     }));

//     mo.observe(container, {
//       attributes: true,
//       subtree: true,
//       childList: true,
//     });
//   }
// }

/**
 *网页加水印 svg 方式
 */
// function svgWM (args) {
//   const {
//     container = document.body,
//     width = 240, height = 135,
//     fontSize = 14,
//     fontFamily = 'Arial',
//     fontWeight = 400,
//     color = 'rgba(0, 0, 0, 0.24)',
//     content = '请勿外传',
//     rotate = -15,
//     zIndex = 1,
//   } = args;
//   const widthNumber = parseInt(width, 10);
//   const heightNumber = parseInt(height, 10);
//   const fontSizeNumber = parseInt(fontSize, 10);
//   const svgStr = `
//     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${widthNumber} ${heightNumber}" width="${widthNumber}px" height="${heightNumber}px">
//       <text
//         x="50%"
//         y="50%"
//         dy="${fontSizeNumber}px"
//         text-anchor="middle"
//         dominant-baseline="middle"
//         font-size="${fontSizeNumber}px"
//         font-family="${fontFamily}"
//         font-weight="${fontWeight}"
//         fill="${color}"
//         transform="rotate(${rotate}, ${widthNumber / 2} ${heightNumber / 2})"
//       >
//         ${content}
//       </text>
//     </svg>
//   `;
//   const base64Url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
//   const __wm = document.querySelector('.__wm');
//   const watermarkDiv = __wm || document.createElement('div');
//   const styleStr = `
//     position: absolute;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     z-index: ${zIndex};
//     pointer-events: none;
//     background-repeat: repeat;
//     background-image: url('${base64Url}')`;
//   watermarkDiv.setAttribute('style', styleStr);
//   watermarkDiv.classList.add('__wm');
//   if (!__wm) {
//     container.style.position = 'relative';
//     container.insertBefore(watermarkDiv, container.firstChild);
//   }
//   const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//   if (MutationObserver) {
//     let mo = new MutationObserver((() => {
//       const __wm__ = document.querySelector('.__wm');
//       // 只在__wm元素变动才重新调用 __canvasWM
//       if ((__wm__ && __wm__.getAttribute('style') !== styleStr) || !__wm__) {
//         // 避免一直触发
//         mo.disconnect();
//         mo = null;
//         svgWM(JSON.parse(JSON.stringify(args)));
//       }
//     }));
//     mo.observe(container, {
//       attributes: true,
//       subtree: true,
//       childList: true,
//     });
//   }
// }

/**
 * 网页水印dom方式
 */
// function domWM (args) {
//   const {
//     container = document.body,
//     width = 240, height = 135,
//     fontSize = 14,
//     fontFamily = 'Arial',
//     fontWeight = 400,
//     color = 'rgba(0, 0, 0, 0.24)',
//     content = '请勿外传',
//     rotate = -15,
//     zIndex = 1,
//   } = args;
//   const widthNumber = parseInt(width, 10);
//   const heightNumber = parseInt(height, 10);
//   const fontSizeNumber = parseInt(fontSize, 10);
//   function createItem () {
//     const div = document.createElement('div');
//     div.setAttribute('style', `
//       position: relative;
//       flex: 0 0 ${widthNumber}px;
//       width: ${widthNumber}px;
//       height: ${heightNumber}px;
//       overflow: hidden;
//       user-select: none;
//       pointer-events: none;
//     `);
//     const span = document.createElement('span');
//     span.setAttribute('style', `
//       position: absolute;
//       top: 50%;
//       left: 50%;
//       font-family: ${fontFamily};
//       font-size: ${fontSizeNumber}px;
//       font-weight: ${fontWeight};
//       color: ${color};
//       transform: rotate(${rotate}deg) translate(-50%, -50%);
//       overflow: hidden;
//       white-space: nowrap;
//       user-select: none;
//       pointer-events: none;
//     `);
//     span.innerHTML = content;
//     div.appendChild(span);
//     return div;
//   }
//   const { clientWidth, clientHeight } = container;
//   const cols = Math.ceil(clientWidth / widthNumber);
//   const rows = Math.ceil(clientHeight / heightNumber);
//   const __wm = document.querySelector('.__wm');
//   const watermarkDiv = __wm || document.createElement('div');
//   const styleStr = `
//     position: absolute;
//     top: 0;
//     left: 0;
//     display: flex;
//     flex-wrap: wrap;
//     width: ${Math.max(clientWidth, widthNumber * cols)}px;
//     height: ${Math.min(clientHeight, heightNumber * rows)}px;
//     z-index: ${zIndex};
//     overflow: hidden;
//     user-select: none;
//     pointer-events: none;
//   `;
//   watermarkDiv.setAttribute('style', styleStr);
//   watermarkDiv.classList.add('__wm');
//   // watermarkDiv.style.display = 'flex';
//   // watermarkDiv.style.flexWrap = 'wrap';
//   // watermarkDiv.style.width = `${widthNumber * cols}px`;
//   // watermarkDiv.style.height = `${heightNumber * rows}px`;
//   for (let i = 0; i < cols * rows; i += 1) {
//     watermarkDiv.appendChild(createItem());
//   }
//   if (!__wm) {
//     container.style.position = 'relative';
//     container.insertBefore(watermarkDiv, container.firstChild);
//   }
//   const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//   if (MutationObserver) {
//     let mo = new MutationObserver((() => {
//       const __wm__ = document.querySelector('.__wm');
//       // 只在__wm元素变动才重新调用 __canvasWM
//       if ((__wm__ && __wm__.getAttribute('style') !== styleStr) || !__wm__) {
//         // 避免一直触发
//         mo.disconnect();
//         mo = null;
//         svgWM(JSON.parse(JSON.stringify(args)));
//       }
//     }));
//     mo.observe(container, {
//       attributes: true,
//       subtree: true,
//       childList: true,
//     });
//   }
// }

/**
 *图片加水印
 *
 * @export
 * @param {*} [{
 *   url = '',
 *   textAlign = 'center',
 *   verticaAlign = 'middle',
 *   fontSize = "20px Microsoft Yahei",
 *   fillStyle = 'rgba(184, 184, 184, 0.8)',
 *   content = '请勿外传',
 *   cb = null,
 *   textX = 100,
 *   textY = 30
 * }={}]
 */
// function __picWM ({
//   url = '',
//   textAlign = 'center',
//   verticaAlign = 'middle',
//   fontSize = '20px Microsoft Yahei',
//   fillStyle = 'rgba(184, 184, 184, 0.8)',
//   content = '请勿外传',
//   cb = null,
//   textX = 100,
//   textY = 30,
// } = {}) {
//   const img = new Image();
//   img.src = url;
//   img.crossOrigin = 'anonymous';
//   img.onload = () => {
//     const canvas = document.createElement('canvas');
//     canvas.width = img.width;
//     canvas.height = img.height;
//     const ctx = canvas.getContext('2d');

//     ctx.drawImage(img, 0, 0);
//     ctx.textAlign = textAlign;
//     ctx.verticaAlign = verticaAlign;
//     ctx.fontSize = fontSize;
//     ctx.fillStyle = fillStyle;
//     ctx.fillText(content, img.width - textX, img.height - textY);

//     const base64Url = canvas.toDataURL();
//     cb && cb(base64Url);
//   };
// }
