import Vue from 'vue';
import Notification from 'ant-design-vue/lib/vc-notification';
import { MESSAGE } from '@lib/config.js';
import Message from './Message.vue';
import AIcon from './AIcon.vue';

const { TOP = 64, GLOBAL } = MESSAGE;

let defaultDuration = null;

let defaultTop = `${TOP}px`;
// 消息实例
let messageInstance;
let prefixCls = 'ant-message';
let transitionName = 'move-up';
let getContainer = () => document.body;
const containerID = 'GLOBAL_MESSAGE_KEY';

/**
 * 获取消息框实例
 * @param {*} callback 回调函数
 */
function getMessageInstance (callback) {
  return messageInstance
    ? callback(messageInstance)
    : Notification.newInstance(
      {
        prefixCls,
        transitionName,
        style: {},
        getContainer,
      },
      (instance) => {
        callback((messageInstance = instance));
      },
    );
}

let timer;
let argsDefault;

function run (args) {
  const hide = notice(args);
  const isNumber = typeof args.duration === 'number';
  if (isNumber) {
    args.duration -= 1;
    if (args.duration < 0) {
      if (timer) {
        clearInterval(timer);
      }
      if (args.type === 'loading') {
        args.close = true;
        return false;
      }
      if (args.onClose && args.onClose instanceof Function) {
        args.onClose();
      }
      hide();
      args.duration = null;
    }
  } else {
    args.close = true;
  }
  return args.duration > 0;
}

const api = {
  config (options) {
    if (options.top !== undefined) {
      defaultTop = options.top;
    }
    if (options.duration !== undefined) {
      defaultDuration = options.duration;
    }
    if (options.prefixCls !== undefined) {
      ({ prefixCls } = options);
    }
    if (options.getContainer !== undefined) {
      ({ getContainer } = options);
    }
    if (options.transitionName !== undefined) {
      ({ transitionName } = options);
    }
    messageInstance = null;
  },
  show (args) {
    clearInterval(timer);
    argsDefault = { ...args };
    if (!(argsDefault.duration >= 0)) {
      argsDefault.duration = null;
      argsDefault.close = true;
    }
    timer = run(argsDefault) && setInterval(run, 1e3, argsDefault);
  },
  close: () => {
    clearInterval(timer);
    if (messageInstance) {
      if (argsDefault.onClose && argsDefault.onClose instanceof Function) {
        argsDefault.onClose(true);
      }
      messageInstance.removeNotice(containerID);
    }
  },
};

const MESSAGE_TYPES = {
  info: 'info',
  success: 'success',
  error: 'error',
  warning: 'warning',
  loading: 'loading',
};
const DEFAULT_MESSAGE_TYPE = MESSAGE_TYPES.info;
const MESSAGE_ICONS = {
  info: 'info-circle',
  success: 'check-circle',
  error: 'close-circle',
  warning: 'exclamation-circle',
  loading: 'loading',
};

function notice (args) {
  const duration = args.duration !== undefined ? args.duration : defaultDuration;
  const type = MESSAGE_TYPES[args.type] || DEFAULT_MESSAGE_TYPE;
  const iconType = MESSAGE_ICONS[type];
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
        style: { top: defaultTop },
        content: (createElement) => createElement(Message, {
          AIcon,
          prefixCls,
          type,
          iconType,
          isLoadingMode,
          duration,
          content: args.content,
          close: args.duration === null || (!(args.duration >= 0) && isLoadingMode),
          closeHandler: () => {
            if (args.onClose && args.onClose instanceof Function) {
              args.onClose(true);
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
if (GLOBAL) {
  if (Vue.prototype.$message) {
    Object.assign(Vue.prototype.$message, api);
  } else {
    Vue.prototype.$message = api;
  }
}

export default api;
