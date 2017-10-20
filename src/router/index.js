import Vue from 'vue'
import Router from 'vue-router'
import Mainpage from '@/components/Mainpage'
import Analytics from '@/components/Analytics'
import Event from '@/components/Event'
import Events from '@/components/Events'
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
      path: '/analytics',
      name: 'Analytics',
      component: Analytics
    },
    {
      path: '/events',
      name: 'Events',
      component: Events
    },
    {
      path: '/events/:hashid/:tab?',
      name: 'Event',
      component: Event
    },
    {
      path: '/:page',
      name: 'StaticPage',
      component: StaticPage
    }
  ]
})
