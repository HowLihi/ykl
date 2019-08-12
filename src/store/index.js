const KEY = 'hm-toutiao-78-user'

// 导出方法
export default {
  setUser (user) {
    const localUser = this.getUser()
    const newUser = { ...localUser, ...user }
    window.sessionStorage.setItem(KEY, JSON.stringify(newUser))
  },
  getUser () {
    return JSON.parse(window.sessionStorage.getItem(KEY) || '{}')
  },
  clearUser () {
    return window.sessionStorage.removeItem(KEY)
  }
}
