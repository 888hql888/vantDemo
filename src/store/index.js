import Vue from 'vue'
import Vuex from 'vuex'
// 导入操作 localstorage 的方法
import { getLoacl, addLocal } from '../utils/processlocal'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户的登录信息
    user: getLoacl('userInfo') || {}
  },
  mutations: {
    // 给 user 赋值，将用户信息保存到 localstorage 中
    setUser(state, payload) {
      // 给 user 赋值 
      state.user = payload
      // 将用户信息保存到 localstorage 中
      addLocal('userInfo', payload)
    }
  }
})
