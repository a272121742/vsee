import $ from '@http';
import staticAxios from './core/static.js';

const isFilePath = (path) => /^(?:\.\/|\.\.\/|\/)\S+\.\S+$/i.test(path);
const isHttpPath = (path) => /^((?:http|https|ftp):\/\/)\S+/i.test(path);
const self = window;

export default function download (data, strFileName, strMimeType) {
  if (strMimeType === true) {
    // window.open(data);
    const f = document.createElement('iframe');
    document.body.appendChild(f);
    f.src = data;
    setTimeout(() => {
      document.body.removeChild(f);
    }, 333);
    return true;
  }
  // 默认下载头
  const defaultMime = 'application/octet-stream';
  let mimeType = strMimeType || defaultMime;
  let payload = data;
  const url = isFilePath(payload) ? payload : (!strFileName && !strMimeType && payload);
  const anchor = document.createElement('a');
  const toString = String;
  const MyBlobEnv = self.Blob || self.MozBlob || self.WebKitBlob || toString;
  let fileName = strFileName || 'download';
  const MyBlob = MyBlobEnv.call ? MyBlobEnv.bind(self) : Blob;

  // reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
  if (String(this) === 'true') {
    payload = [payload, mimeType];
    mimeType = payload[0];
    payload = payload[1];
  }

  if (url && url.length < 2048 && !isHttpPath(url)) {
    // if no filename and no mime, assume a url was passed as the only argument
    fileName = url
      .split('/')
      .pop()
      .split('?')[0];
    // 设置下载地址
    anchor.setAttribute('href', url);
    if (anchor.href.indexOf(url) !== -1) {
      // 如果属于接口调用
      if (url.indexOf('/api') === -1) {
        staticAxios.get(url, { responseType: 'blob' }).then((res) => {
          download(res.data, strFileName || fileName, defaultMime);
        });
        return true;
      }
      const config = {
        responseType: 'blob',
      };
      $.get(url.slice(4), void 0, config).then();
      return true;
    }
  }

  // go ahead and download dataURLs right away
  if (/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)) {
    if (payload.length > 1024 * 1024 * 1.999 && MyBlob !== toString) {
      payload = dataUrlToBlob(payload);
      mimeType = payload.type || defaultMime;
    } else {
      return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
        ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
        : saver(payload); // everyone else can save dataURLs un-processed
    }
  } else if (/([\x80-\xff])/.test(payload)) {
    // not data url, is it a string with special needs?
    let i = 0;
    const tempUiArr = new Uint8Array(payload.length);
    const mx = tempUiArr.length;
    for (i; i < mx; i += 1) tempUiArr[i] = payload.charCodeAt(i);
    payload = new MyBlob([tempUiArr], {
      type: mimeType,
    });
  }
  const blob = payload instanceof MyBlob ? payload : new MyBlob([payload], {
    type: mimeType,
  });

  function dataUrlToBlob (strUrl) {
    const parts = strUrl.split(/[:;,]/);
    const type = parts[1];
    const indexDecoder = strUrl.indexOf('charset') > 0 ? 3 : 2;
    const decoder = parts[indexDecoder] === 'base64' ? atob : decodeURIComponent;
    const binData = decoder(parts.pop());
    const mx = binData.length;
    let i = 0;
    const uiArr = new Uint8Array(mx);

    for (i; i < mx; i += 1) uiArr[i] = binData.charCodeAt(i);

    return new MyBlob([uiArr], {
      type,
    });
  }

  function saver (href, winMode) {
    if ('download' in anchor) {
      // html5 A[download]
      const isIE = !!(document.all && typeof (document.all) === 'object');
      const e = document.createEvent(isIE ? 'HTMLEvents' : 'MouseEvent');
      anchor.setAttribute('style', 'display:none');
      anchor.setAttribute('href', href);
      anchor.setAttribute('download', fileName);
      e.initEvent('click', true, true);
      document.body.appendChild(anchor);
      anchor.dispatchEvent(e);
      document.body.removeChild(anchor);
      self.URL.revokeObjectURL(anchor.href);
      return true;
    }
    let link = href;
    // handle non-a[download] safari as best we can:
    if (/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
      if (/^data:/.test(href)) {
        link = `data:${href.replace(/^data:([\w/\-+]+)/, defaultMime)}`;
      }
      if (!window.open(link)) {
        // popup blocked, offer direct download:
        if (
          // eslint-disable-next-line no-alert
          window.confirm(
            'Displaying New Document\n\nUse Save As... to download, then click back to return to this page.',
          )
        ) {
          window.location.href = link;
        }
      }
      return true;
    }
    // do iframe dataURL download (old ch+FF):
    const f = document.createElement('iframe');
    document.body.appendChild(f);

    if (!winMode && /^data:/.test(href)) {
      // force a mime that will download:
      link = `data:${href.replace(/^data:([\w/\-+]+)/, defaultMime)}`;
    }
    f.src = link;
    setTimeout(() => {
      document.body.removeChild(f);
    }, 333);
    return true;
  }

  // 外部连接（带有http、https或者ftp）
  // if (isHttpPath(url)) {
  //   console.error('外部连接暂时不支持下载', data);
  // }
  if (navigator.msSaveBlob) {
    // IE10+ : (has Blob, but not a[download] or URL)
    return window.navigator.msSaveBlob(blob, fileName);
  }

  if (self.URL) {
    // simple fast and modern way using Blob and URL:
    return saver(isFilePath(payload) ? payload : self.URL.createObjectURL(blob), true);
  } if (typeof blob === 'string' || blob.constructor === toString) {
    // handle non-Blob()+non-URL browsers:
    try {
      return saver(`data:${mimeType};base64,${self.btoa(blob)}`);
    } catch {
      return saver(`data:${mimeType},${encodeURIComponent(blob)}`);
    }
  }

  // Blob but not URL support:
  const reader = new FileReader();
  reader.onload = function onload () {
    saver(this.result);
  };
  reader.readAsDataURL(blob);
  return true;
}
