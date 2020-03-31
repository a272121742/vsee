import AsyncLoading from './AsyncLoading.vue';
import AsyncError from './AsyncError.vue';

function factory (path, delay = 0, timeout = 60000) {
  const useCompLib = path.charAt(0) === '@';
  const compPath = useCompLib ? path.split('/').slice(1).join('/') : path.charAt(0) === '/' ? path.slice(1) : path;
  return () => ({
    // 需要加载的组件
    component: useCompLib ? import(`@comp/${compPath}`).catch(() => AsyncError) : import(`~/${compPath}`).catch(() => AsyncError),
    // component: import(`${this.file}`),
    // 异步加载过程中的loading状态（可以是一个组件）
    loading: AsyncLoading, // 根据系统要求定制化加载页面
    // 异步加载后错误时显示的页面（可以是一个组件）
    error: AsyncError, // 根据系统要求定制化错误页面
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    // 如果delay值过小，则容器生成后延时较短时间开始加载异步组件，此时会出现loading组件
    // 如果delay过大，则容器生成后立马加载异步组件，此时不会出现loading组件
    delay,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout,
  });
}

// function resolvePath (path) {
//   const pathArray = path.split('/');
//   const root = pathArray[0] ? pathArray[0] : '~';
//   const compPath = pathArray.slice(1).join('/');
//   return [root, compPath];
// }

export default factory;
