import Vue from 'vue'
import Router from 'vue-router'
import Mainpage from '@/components/Mainpage'
import Event from '@/components/Event'
import Events from '@/components/Events'
import MomentTensor from '@/components/MomentTensor'
import StaticPage from '@/components/StaticPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mainpage',
      component: Mainpage
    },
    {
      path: '/events',
      name: 'Events',
      component: Events
    },
    {
      path: '/events/:hashid',
      name: 'Event',
      component: Event
    },
    {
      path: '/events/:hashid/moment-tensor',
      name: 'MomentTensor',
      component: MomentTensor
    },
    {
      path: '/:page',
      name: 'StaticPage',
      component: StaticPage
    }
  ]
})
