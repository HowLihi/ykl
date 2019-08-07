import router from '../router'
import store from '../store'
import axios from '../api'

// 登录逻辑
// 登陆成功后从服务器获取信息,将用户信息保存到sessionStorage中,需要的时候调用就行了
const KEY = '黑马头条个人信息'
// userInfo => sessionStorage.setItem(KEY, JSON.stringify(userInfo))
function setUser (userInfo) {
  window.sessionStorage.setItem(KEY, JSON.stringify(userInfo))
}
setUser()
function getUser () {
  return JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
}
getUser()
// 路由守卫: 每次跳转路由之前都要检验sessionStorage是否存在用户信息
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.getUser().token) return next('/login')
  next()
})
// 需求: 每次请求时头部携带token,要用到请求拦截器,对axios进行配置
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.getUser().token}`
  return config
},
// 如果出错返回一个错误的Promise对象
(err) => {
  return Promise.reject(err)
})
// 后台进行token比对时候会有一个有效期限,如果超过有效期限,头部的token与服务端的对应不上,就会报错401
// 所以设置响应拦截器,监听所有接口响应是不是401,如果是就会拦截到登录页
axios.interceptors.response.use((res) => {
  // 如果成功返回响应结果
  return res
}, (err) => {
  // 如果失败返回登录页
  if (err.response.status === 401) {
    location.hash = '#/login'
  }
  return Promise.reject(err)
}
)
