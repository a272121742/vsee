// /* eslint-disable no-shadow */
// /**
//  * 提供文件相关的帮助
//  */

// export const download = ({
//   url,
//   filename,
//   header = {},
//   callback = () => {},
//   blob = false,
//   download = true,
//   progress = () => {},
// }) => {
//   const oReq = new XMLHttpRequest();
//   Object.entries(header).forEach((h) => {
//     oReq.setRequestHeader(h[0], h[1]);
//   });
//   oReq.open('GET', url, true); // '/minio/download.htm?id=25'
//   oReq.responseType = 'blob';
//   oReq.addEventListener('progress', ({ total, loaded }) => progress(total, loaded), false);
//   oReq.onload = () => {
//     if (oReq.response.size === 0 || oReq.status === 404) {
//       if (window.confirm('文件为空或不存在，确定继续执行吗')) {
//         __fun();
//       }
//       return callback();
//     } __fun();


//     function __fun () {
//       const _blob = new Blob([oReq.response]);
//       if (download) {
//         const elink = document.createElement('a');
//         const hasFileName = oReq.getResponseHeader('content-disposition');
//         elink.download = filename || (hasFileName && decodeURI(hasFileName.split(`UTF-8''`)[1])) || '未命名.你想要的扩展名';
//         elink.style.display = 'none';
//         elink.href = URL.createObjectURL(_blob);
//         elink.target = '_blank';
//         document.body.appendChild(elink);
//         elink.click();
//         document.body.removeChild(elink);
//         if (!blob) callback();
//       }
//       if (blob) {
//         callback(_blob);
//       }
//     }
//   };
//   oReq.send();
// };

// export const upload = 'upload';
