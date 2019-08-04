import axios from 'axios'
import store from '@/store'
// 配置基准路径
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 请求头字段
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${store.getUser().token}`
  return config
}, (err) => { return Promise.reject(err) })
// 响应拦截器
axios.interceptors.response.use((res) => {
  return res
}, (err) => {
  if (err.response.stutas === 401) {
    location.hash = '#/login'
  }
  return Promise.reject(err)
})
export default axios
