import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 导入 vant
import Vant from 'vant'
// 导入 vant 的样式
import 'vant/lib/index.css'
// 导入字体文件
import './styles/font.css'
// 导入 登录方法
import loginplugs from './utils/mylogin'

// 导入 dayjs
import dayjs from 'dayjs'
// 导入插件
import relativeTIme from 'dayjs/plugin/relativeTime'
// 导入语言包
import 'dayjs/locale/zh-cn'
// 全局使用
dayjs.locale('zh-cn')
// 扩展插件
dayjs.extend(relativeTIme)
// -------------------------dayjs 的使用---------------------------------
// 基本使用
// let time = dayjs().format('YYYY-MM-DD hh:mm:ss')
// let time = dayjs().from(dayjs('1990'))
// // 得到时间间隔：
// console.log(time)
// 将得到时间间隔的代码封装为过滤器
Vue.filter('spaceTime', function (value) {
  // value 是使用这个过滤器的字符串
  return dayjs().from(dayjs(value))
})
// ----------------------------------------------------------

// 使用 vant
Vue.use(Vant)
Vue.use(loginplugs) // loginplugs.install

// // 封装一个全局的登录方法：
// Vue.prototype.$login = function () {
//   // 得到用户信息
//   let user = store.state.user
//   // 判断
//   if (!user || !user.token) {
//     // 用户没有登录
//     // 跳转到登录页面
//     this.$router.push('/login')
//     return false
//   } 
//   // 用户登录
//   return true
// }

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
