// 用来操作 localStorage

// 添加 localStorage
function addLocal(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

// 删除 localStorage
function delLocal(key) {
  window.localStorage.removeItem(key);
}

// 得到 localStorage
function getLoacl(key) {
  return JSON.parse(window.localStorage.getItem(key));
}

// 按需导出
export { addLocal, delLocal, getLoacl };

export default {}
// 暴露的规则：
//   默认导出
//      export default {}
//      import obj from ''
//   按需导出
//      export { addLocal,  delLocal, getLoacl }
//   按需导入
//      import { getLoacl } from ''
