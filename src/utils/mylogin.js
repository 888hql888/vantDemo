// 封装一个登录验证的插件

// 导入 store
import store from "../store";

export default {
  // 登录验证： otherlogin
  install: function(Vue) {
    Vue.prototype.$login = function() {
      // 得到用户信息
      let user = store.state.user;
      // 判断
      if (!user || !user.token) {
        // 用户没有登录
        // 跳转到登录页面
        this.$router.push("/otherlogin");
        return false;
      }
      // 用户登录
      return true;
    };
  }
};

// // 创建一个插件对象
// var myloginplugs = {};

// // 插件对象添加一个 install 方法：第一个参数为 Vue
// myloginplugs.install = function(Vue) {
//   // 执行逻辑
//   // 给 Vue 添加一个实例方法
//   Vue.prototype.$login = function() {
//     // 得到用户信息
//     let user = store.state.user;
//     // 判断
//     if (!user || !user.token) {
//       // 用户没有登录
//       // 跳转到登录页面
//       this.$router.push("/login");
//       return false;
//     }
//     // 用户登录
//     return true;
//   };
// };

// // 暴露插件对象
// export default myloginplugs;
