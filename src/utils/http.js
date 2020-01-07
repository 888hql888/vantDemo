import axios from "axios";
import store from "../store";
// 导入 json-bigint
import jsonbig from "json-bigint";

// // 创建一个 axios 实例
//   create 方法：可以用来创建一个 axios 实例
//      这个实例的使用与导入的 axios 作用是一样的：
//          可以用 来发送请求
//          可以设置基准地址
//          可以设置拦截器
const instance = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/app/v1_0",
  // 处理响应回的数据
  transformResponse: [
    function(data) {
      // data：就是服务器响应回来的数据
      try {
        return jsonbig.parse(data);
      } catch (error) {
        return data;
      }
    }
  ]
});

// 再次创建一个 axios 实例
const instance2 = axios.create()

// 请求拦截器
instance.interceptors.request.use(
  function(config) {
    // 用户登录时才需要：携带一个 token
    let user = store.state.user;
    // 判断
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function(response) {
    // 成功时的函数
    return response;
  },
  async function(error) {
    // error config 本次请求的所有配置 requrest 本次请求的所有请求信息 reponse 本次请求的所有响应信息
    console.log('-------------------interceptors.response------------------------')
    // 处理错误为 401 的响应： 401 token 失效
    if (error.response.status === 401) {
      // 得到用户的 refresh_token
      let user = store.state.user
      // 重新发送请求到服务器去更新 token
      let res = await instance2({
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        method: 'PUT', 
        headers: {  
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      // 得到更新之后的token
      let newToken = res.data.data.token
      // 将新的 token 赋值给 store 下面的 state
      user.token = newToken
      // 重新将 token 保存起来：1）vuex 中，2）localstoreage 中
      store.commit('setUser', user)
      // 继续未完成的请求
      return instance(error.config) // 又会发送一个请求到服务器，由于这次的 token 已经更新的了，所有请求就会成功
    }
    console.log('-------------------interceptors.response------------------------')
    // 失败时的函数
    return Promise.reject(error);
  }
);

// 暴露对象
export default instance;
