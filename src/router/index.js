import Vue from "vue";
import Router from "vue-router";
// 导入 usevant 组件
import useVant from "../views/useVant.vue";
// 导入 login 组件
// let login = () => import('../views/login') // 路由的懒加载

Vue.use(Router);

export default new Router({
  routes: [
    // 设置一个重定向： /home
    { path: "/", redirect: "/home" },
    { path: "/usevant", name: "usevant", component: useVant },
    // 添加路由：login 用来处理用户登录的逻辑
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login")
    },
    // 添加路由： otherlogin 用来处理用户验证登录的逻辑
    {
       path: '/otherlogin',
       name: 'otherlogin',
       component: () => import('../views/login')
    },
    // 添加一个布局组件
    {
      path: "/layout",
      name: "layout",
      component: () => import("../views/layout"),
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("../views/home")
        },
        { path: "/my", name: "my", component: () => import("../views/my") },
        // 添加 搜索页面
        {
          path: "/search",
          name: "search",
          component: () => import("../views/search")
        }
      ]
    },
    {
      path: "/searchList/:key",
      name: "searchList",
      component: () => import("../views/searchList")
    },
    {
      path: "/detail/:artid",
      name: "detail",
      component: () => import("../views/detail")
    },
    // 个人信息页面
    {
      path: "/person",
      name: "person",
      component: () => import("../views/person")
    },
    // 小智同学
    {
      path: "/zhi",
      name: "zhi",
      component: () => import("../views/zhi")
    }
  ]
});
