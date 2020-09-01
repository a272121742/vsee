/* eslint-disable class-methods-use-this */
// import download from './download.js';

/*!
 * 源码
 * https://github.com/AleeeKoi/js-file-downloader
 *
 * 修改：loong.qian
 * 解决文件名未做转义处理
 */
const defaultParams = {
  timeout: 6E4,
  mobileDisabled: true,
  headers: [],
  forceDesktopMode: false,
  autoStart: true,
  includeCredentials: false,
  method: 'GET',
  nameCallback: (name) => name,
};

class jsFileDownloader {
  constructor (customParams = {}) {
    this.params = { ...defaultParams, ...customParams };
    this.link = this.createLink();
    this.request = null;

    if (this.params.autoStart) return this.downloadFile();
  }

  start () {
    return this.downloadFile();
  }

  downloadFile () {
    return new Promise((resolve, reject) => {
      this.initDonwload(resolve, reject);
    });
  }

  initDonwload (resolve, reject) {
    if (!('download' in this.link) || this.isMobile()) {
      this.link.target = '_blank';
      this.link.rel = 'noopener';
      this.link.href = this.params.url;
      this.clickLink();
      return resolve();
    }
    this.request = this.createRequest();
    if (!this.params.url) {
      return reject('Downloader error: url param not defined!');
    }
    this.request.onload = () => {
      try {
        if (parseInt(this.request.status, 10) !== 200) {
          throw downloadException(`status code [${this.request.status}]`);
        }
        this.startDownload();
        resolve(this);
      } catch (error) {
        reject(new Error(`Downloader error: ${error}`));
      }
    };
    this.request.ontimeout = () => {
      reject(new Error('Downloader error: request timeout'));
    };
    this.request.onerror = (e) => {
      reject(e);
    };
    this.request.send();
    return this;
  }

  isMobile () {
    return !this.params.forceDesktopMode
      && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  createRequest () {
    const request = new XMLHttpRequest();
    request.open(this.params.method, this.params.url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    this.params.headers.forEach((header) => {
      request.setRequestHeader(header.name, header.value);
    });
    request.responseType = 'arraybuffer';
    if (this.params.process && typeof this.params.process === 'function') {
      request.addEventListener('progress', this.params.process);
    }
    request.timeout = this.params.timeout;
    request.withCredentials = this.params.includeCredentials;
    return request;
  }

  getFileName () {
    if (typeof this.params.filename === 'string') {
      return this.params.filename;
    }
    const content = this.request.getResponseHeader('Content-Disposition');
    let contentParts = [];
    if (content) {
      contentParts = content.replace(/["']/g, '').match(/filename\*?=([^;]+)/);
    }
    const extractedName = contentParts && contentParts.length >= 1
      ? contentParts[1]
      : this.params.url.split('/').pop().split('?')[0];
    return this.params.nameCallback(window.decodeURIComponent(extractedName));
  }

  createLink () {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.setAttribute('download', true);
    return link;
  }

  clickLink () {
    let event;
    try {
      const isIE = !!(document.all && typeof (document.all) === 'object');
      event = document.createEvent(isIE ? 'HTMLEvents' : 'MouseEvent');
      event.initEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      // event = new MouseEvent('click');
    } catch (e) {
      event = document.createEvent('MouseEvent');
      event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    this.link.dispatchEvent(event);
  }

  getFile (response, fileName) {
    let file = null;
    const options = { type: 'application/octet-stream' };

    try {
      file = new File([response], fileName, options);
    } catch (e) {
      file = new Blob([response], options);
      file.name = fileName;
      file.lastModifiedDate = new Date();
    }
    return file;
  }

  startDownload () {
    const fileName = this.getFileName(this.request);
    const file = this.getFile(this.request.response, fileName);
    // native IE
    if ('msSaveOrOpenBlob' in window.navigator) {
      return window.navigator.msSaveOrOpenBlob(file, fileName);
    }
    const objectUrl = window.URL.createObjectURL(file);
    this.link.href = objectUrl;
    this.link.download = fileName;
    this.clickLink();
    setTimeout(() => {
      (window.URL || window.webkitURL || window).revokeObjectURL(objectUrl);
    }, 4E4);
    return this;
  }
  // startDownload () {
  //   const fileName = this.getFileName(this.request);
  //   const file = this.getFile(this.request.response, fileName);
  //   download(file, fileName);
  // }
}

export default jsFileDownloader;

function downloadException (message) {
  this.message = message;
  this.name = 'downloadException';
}
