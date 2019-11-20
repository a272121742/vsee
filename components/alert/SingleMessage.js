import Notification from 'ant-design-vue/lib/vc-notification';
import Icon from 'ant-design-vue/lib/icon';

/**
 * 三种弹出机制，
 * 1. 不显示倒计时，但显示关闭；
 * 2. 不显示关闭，显示倒计时，有loading状态；
 * 3. 显示loading，但不显示时间和关闭
 */

// 默认不自动关闭
const defaultDuration =  null;
const closeStyle = {
  color: 'rgba(0, 0, 0, 0.45)',
  'font-size': '12px',
  cursor: 'pointer',
  float: 'right', 
  'margin': '3px 5px'
};

let defaultTop;
// 消息实例
let messageInstance;
let prefixCls = 'ant-message';
let transitionName = 'move-up';
let getContainer = () => document.body;
const key = 'SINGLE_MESSAGE_KEY';

/**
 * 创建单例实例
 * @param {*} callback 
 */
function getMessageInstance (callback) {
  if (messageInstance) {
    callback(messageInstance);
    return;
  }
  Notification.newInstance({
    prefixCls,
    transitionName,
    style: { top: defaultTop }, // 覆盖原来的样式
    getContainer,
  }, instance => {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning';

function notice (args) {
  // 停留时间，默认一直停留
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  // 获取类型
  const type = ~['info', 'success', 'error', 'warning', 'loading'].indexOf(args.type) ? args.type : 'info';
  const iconType = {
    info: 'info-circle',
    success: 'check-circle',
    error: 'close-circle',
    warning: 'exclamation-circle',
    loading: 'loading',
  }[type];
  const isLoadingMode = type === 'loading';
  // 关闭回调
  const closePromise = new Promise(resolve => {
    const callback = () => {
      if (typeof args.onClose === 'function') {
        args.onClose();
      }
      return resolve(true);
    };
    // 获取实例
    getMessageInstance(instance => {
      instance.notice({
        key,
        duration,
        style: {},
        content: () => 
          `<div>123</div>`
        ,
        // content: h => (
        // <div
        //   class={`${prefixCls}-custom-content${type ? ` ${prefixCls}-${type}` : ''}`}
        //   style={{ 'max-width': '480px', 'text-align': 'left' }}
        // >
        //   {args.icon ? (
        //     typeof args.icon === 'function' ? (
        //       args.icon(h)
        //     ) : (
        //       args.icon
        //     )
        //   ) : iconType ? (
        //     <Icon type={iconType} theme={ isLoadingMode ? 'outlined' : 'filled' } />
        //   ) : (
        //     ''
        //   )}
        //   <span>{typeof args.content === 'function' ? args.content(h) : args.content}</span>
        //   {
        //     isLoadingMode ? '' : (
        //       (duration !== null && duration >= 0) ? (
        //         <span style={{ float: 'right', 'margin': 'auto 5px auto 24px' }}>
        //           <Icon type='loading' theme='outlined' />
        //           <span style={{ color: 'rgb(153, 153, 153)' }}> { duration }s </span>
        //         </span>
        //       ) : (
        //         <Icon onClick={() => instance.removeNotice(key)} type='close' class={`${prefixCls}-close-icon`} style={closeStyle} />
        //       )
        //     )
        //   }
        // </div>
        // ),
        onClose: callback,
      });
    });
  });
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(key);
    }
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

let timer;
let argsDefault = {};

const api = {
  show: (args) => {
    argsDefault = Object.assign({}, argsDefault, args);
    if (argsDefault.type === 'loading') {
      argsDefault.duration = null;
    }
    if (timer) {
      clearInterval(timer);
    } 
    function run () {
      const hide = notice(argsDefault);
      const isNumber = typeof argsDefault.duration === 'number';
      if (isNumber) {
        argsDefault.duration--;
      }
      if (isNumber && argsDefault.duration < 0) {
        clearInterval(timer);
        hide();
        argsDefault.duration = null;
      }
      return argsDefault.duration > 0;
    }
    timer = run() && setInterval(run, 1000);
  },
  close: () => {
    if (timer) {
      clearInterval(timer);
    } 
    if (messageInstance) {
      messageInstance.removeNotice(key);
    }
  }
};

export default api;