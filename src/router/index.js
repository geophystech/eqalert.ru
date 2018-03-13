import Vue from 'vue'
import Router from 'vue-router'
import Mainpage from '@/components/Mainpage'
import Analytics from '@/components/Analytics'
import Event from '@/components/Event'
import Events from '@/components/Events'
import StaticPage from '@/components/StaticPage'
import UserEmailConfirmation from '@/components/users/Confirmation'
import UserAuthorization from '@/components/users/Authorization'
import UserRegistration from '@/components/users/Registration'
import UserResetPassword from '@/components/users/ResetPassword'

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
      path: '/register/confirm/:token',
      name: 'UserEmailConfirmation',
      component: UserEmailConfirmation
    },
    {
      path: '/sign-in',
      name: 'UserAuthorization',
      component: UserAuthorization
    },
    {
      path: '/reset-password',
      name: 'UserResetPassword',
      component: UserResetPassword
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
