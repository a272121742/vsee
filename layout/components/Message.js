import Notification from 'ant-design-vue/lib/vc-notification';
import Vue from 'vue';
import Message from './Message.vue';
import AIcon from './AIcon.vue';

/**
 * 三种弹出机制，
 * 1. 不显示倒计时，但显示关闭；
 * 2. 不显示关闭，显示倒计时，有loading状态；
 * 3. 显示loading，但不显示时间和关闭
 */

// 默认不自动关闭
const defaultDuration = null;

const defaultTop = '12px';
// 消息实例
let messageInstance;
const prefixCls = 'ant-message';
const transitionName = 'move-up';
const getContainer = () => document.body;
const containerID = 'GLOBAL_MESSAGE_KEY';

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
  }, (instance) => {
    if (messageInstance) {
      callback(messageInstance);
      return;
    }
    messageInstance = instance;
    callback(instance);
  });
}

// type NoticeType = 'info' | 'success' | 'error' | 'warning';

let timer;
let argsDefault;

const api = {
  show: (args) => {
    argsDefault = { ...args };
    if (!(argsDefault.duration >= 0)) {
      argsDefault.duration = null;
    }
    if (timer) {
      clearInterval(timer);
    }
    function run () {
      const hide = notice(argsDefault);
      const isNumber = typeof argsDefault.duration === 'number';
      if (isNumber) {
        argsDefault.duration -= 1;
      }
      if (isNumber && argsDefault.duration < 0) {
        if (timer) {
          clearInterval(timer);
        }
        if (argsDefault.type === 'loading') {
          argsDefault.close = true;
          return false;
        }
        if (argsDefault.onClose && argsDefault.onClose instanceof Function) {
          argsDefault.onClose();
        }
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
      messageInstance.removeNotice(containerID);
      if (argsDefault.onClose && argsDefault.onClose instanceof Function) {
        argsDefault.onClose();
      }
    }
  },
};

function notice (args) {
  // // 停留时间，默认一直停留
  const duration = (args.duration !== undefined) ? args.duration : defaultDuration;
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
  const closePromise = new Promise((resolve) => {
    const callback = () => {
      if (args.onClose instanceof Function) {
        args.onClose();
      }
      return resolve(true);
    };
    // 获取实例
    getMessageInstance((instance) => {
      instance.notice({
        key: containerID,
        duration: null,
        style: {},
        content: (createElement) => createElement(Message, {
          AIcon,
          prefixCls,
          type,
          iconType,
          isLoadingMode,
          duration,
          content: args.content,
          close: (args.duration < 0 && isLoadingMode) || (!isLoadingMode && args.duration === null),
          closeHandler: () => {
            if (args.onClose && args.onClose instanceof Function) {
              args.onClose();
              if (timer) {
                clearInterval(timer);
              }
            }
            instance.removeNotice(containerID);
          },
        }),
        onClose: callback,
      });
    });
  });
  const result = () => {
    if (messageInstance) {
      messageInstance.removeNotice(containerID);
    }
  };
  result.then = (filled, rejected) => closePromise.then(filled, rejected);
  result.promise = closePromise;
  return result;
}

if (Vue.prototype.$message) {
  Object.assign(Vue.prototype.$message, api);
} else {
  Vue.prototype.$message = api;
}

export default api;
