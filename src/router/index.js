import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Mainpage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mainpage',
      component: Hello
    }
  ]
})
