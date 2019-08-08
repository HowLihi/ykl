import Vue from 'vue'
import VueRouter from 'vue-router'
import appLogin from '../components/login/index.vue'
import Home from '../components/home/index.vue'
import Welcome from '../components/home/welcome.vue'
import Article from '../components/home/article.vue'
import Photos from '../components/photos/index.vue'
import notFound from '../components/home/notFound.vue'
import store from '../store'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/login', component: appLogin },
    { path: '/',
      component: Home,
      children: [
        { path: '', component: Welcome },
        { path: '/article', component: Article },
        { path: '/image', component: Photos }
      ] },
    // 路径404
    { path: '*', name: '404', component: notFound }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path !== '/login' && !store.getUser().token) return next('/login')
  next()
})
export default router
