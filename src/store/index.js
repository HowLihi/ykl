const KEY = 'hm-toutiao-78-user'

// 导出方法
export default {
  setUser (user) {
    window.sessionStorage.setItem(KEY, JSON.stringify(user))
  },
  getUser () {
    return JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
  },
  clearUser () {
    return window.sessionStorage.removeItem(KEY)
  }
}
