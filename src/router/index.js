import Vue from 'vue'
import VueRouter from 'vue-router'
import appLogin from '../components/login/index.vue'
import Home from '../components/home/index.vue'
import Welcome from '../components/home/welcome.vue'
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    { path: '/login', component: appLogin },
    { path: '/',
      component: Home,
      children: [
        { path: '', component: Welcome }
      ] }
  ]
})
export default router
