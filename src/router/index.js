import Vue from 'vue'
import Router from 'vue-router'
import Mainpage from '@/components/Mainpage'
import Analytics from '@/components/Analytics'
import Event from '@/components/Event'
import Events from '@/components/Events'
import StaticPage from '@/components/StaticPage'
import UserRegistration from '@/components/users/Registration'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mainpage',
      component: Mainpage
    },
    {
      path: '/register',
      name: 'UserRegistration',
      component: UserRegistration
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
      path: '/events/:id/:tab?',
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
