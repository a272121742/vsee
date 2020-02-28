/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-shadow */
/* eslint-disable no-mixed-operators */
import Vue from 'vue';

Vue.directive('water-mark', (el, binding, vnode) => {
  console.log('water-mark', el, vnode);
  const options = { ...binding.value };
  if (vnode.componentInstance) {
    vnode.componentInstance.$nextTick(() => {
      console.log('渲染水印', options.el, el);
      canvasWM({
        container: options.el || el || document.body,
      });
    });
  }
});

/**
 * 网页加水印（Canvas版）
 *
 * @export
 * @param {*} [{
 *   container = document.body,
 *   width = '400px',
 *   height = '300px',
 *   textAlign = 'center',
 *   textBaseline = 'middle',
 *   font = "20px",
 *   fillStyle = 'rgba(230, 230, 230, 0.8)',
 *   content = '保密水印',
 *   rotate = '10',
 *   zIndex = -1000
 * }={}]
 * @returns
 */
function canvasWM ({
  // 使用 ES6 的函数默认值方式设置参数的默认取值
  // 具体参见 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Default_parameters
  container = document.body,
  width = '300px',
  height = '200px',
  textAlign = 'center',
  textBaseline = 'middle',
  font = '20px',
  fillStyle = 'rgba(184, 184, 184, 0.6)',
  content = '请勿外传',
  rotate = '30',
  zIndex = 1000,
} = {}) {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments[0];
  const canvas = document.createElement('canvas');

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  const ctx = canvas.getContext('2d');

  ctx.textAlign = textAlign;
  ctx.textBaseline = textBaseline;
  ctx.font = font;
  ctx.fillStyle = fillStyle;
  ctx.rotate(Math.PI / 180 * rotate);
  ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2);

  const base64Url = canvas.toDataURL();
  const __wm = document.querySelector('.__wm');

  const watermarkDiv = __wm || document.createElement('div');
  const styleStr = `
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:${zIndex};
    pointer-events:none;
    background-repeat:repeat;
    background-image:url('${base64Url}')`;

  watermarkDiv.setAttribute('style', styleStr);
  watermarkDiv.classList.add('__wm');

  if (!__wm) {
    container.style.position = 'relative';
    container.insertBefore(watermarkDiv, container.firstChild);
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  if (MutationObserver) {
    let mo = new MutationObserver((() => {
      const __wm = document.querySelector('.__wm');
      // 只在__wm元素变动才重新调用 __canvasWM
      if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
        // 避免一直触发
        mo.disconnect();
        mo = null;
        canvasWM(JSON.parse(JSON.stringify(args)));
      }
    }));

    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}

/**
 *网页加水印 svg 方式
 *
 * @export
 * @param {*} [{
 *   container = document.body,
 *   content = '请勿外传',
 *   width = '300px',
 *   height = '200px',
 *   opacity = '0.2',
 *   fontSize = '20px',
 *   zIndex = 1000
 * }={}]
 */
function __waterDocumentSvg ({
  container = document.body,
  content = '请勿外传',
  width = '300px',
  height = '200px',
  opacity = '0.2',
  fontSize = '20px',
  zIndex = 1000,
} = {}) {
  // eslint-disable-next-line prefer-rest-params
  const args = arguments[0];
  const svgStr = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}">
      <text x="50%" y="50%" dy="12px"
      text-anchor="middle"
      stroke="#000000"
      stroke-width="1"
      stroke-opacity="${opacity}"
      fill="none"
      transform="rotate(-45, 120 120)"
      style="font-size: ${fontSize};">
      ${content}
      </text>
    </svg>
  `;
  const base64Url = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svgStr)))}`;
  const __wm = document.querySelector('.__wm');
  const watermarkDiv = __wm || document.createElement('div');
  const styleStr = `
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:${zIndex};
    pointer-events:none;
    background-repeat:repeat;
    background-image:url('${base64Url}')`;
  watermarkDiv.setAttribute('style', styleStr);
  watermarkDiv.classList.add('__wm');
  if (!__wm) {
    container.style.position = 'relative';
    container.insertBefore(watermarkDiv, container.firstChild);
  }
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  if (MutationObserver) {
    let mo = new MutationObserver((() => {
      const __wm = document.querySelector('.__wm');
      // 只在__wm元素变动才重新调用 __canvasWM
      if ((__wm && __wm.getAttribute('style') !== styleStr) || !__wm) {
        // 避免一直触发
        mo.disconnect();
        mo = null;
        __waterDocumentSvg(JSON.parse(JSON.stringify(args)));
      }
    }));
    mo.observe(container, {
      attributes: true,
      subtree: true,
      childList: true,
    });
  }
}
/**
 *图片加水印
 *
 * @export
 * @param {*} [{
 *   url = '',
 *   textAlign = 'center',
 *   textBaseline = 'middle',
 *   font = "20px Microsoft Yahei",
 *   fillStyle = 'rgba(184, 184, 184, 0.8)',
 *   content = '请勿外传',
 *   cb = null,
 *   textX = 100,
 *   textY = 30
 * }={}]
 */
function __picWM ({
  url = '',
  textAlign = 'center',
  textBaseline = 'middle',
  font = '20px Microsoft Yahei',
  fillStyle = 'rgba(184, 184, 184, 0.8)',
  content = '请勿外传',
  cb = null,
  textX = 100,
  textY = 30,
} = {}) {
  const img = new Image();
  img.src = url;
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    ctx.textAlign = textAlign;
    ctx.textBaseline = textBaseline;
    ctx.font = font;
    ctx.fillStyle = fillStyle;
    ctx.fillText(content, img.width - textX, img.height - textY);

    const base64Url = canvas.toDataURL();
    cb && cb(base64Url);
  };
}
