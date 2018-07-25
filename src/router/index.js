import Vue from 'vue'
import Router from 'vue-router'
import Mainpage from '@/components/Mainpage'
import Analytics from '@/components/Analytics'
import Event from '@/components/Event'
import Events from '@/components/Events'
import Meta from 'vue-meta'
import StaticPage from '@/components/StaticPage'
import UserEmailConfirmation from '@/components/users/Confirmation'
import UserAuthentication from '@/components/users/Authentication'
import UserRegistration from '@/components/users/Registration'
import UserConfirmPassword from '@/components/users/ConfirmPassword'
import UserResetPassword from '@/components/users/ResetPassword'

Vue.use(Router)
Vue.use(Meta)

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
      component: UserRegistration,
      meta: { redirectable: false }
    },
    {
      path: '/register/confirm/:token',
      name: 'UserEmailConfirmation',
      component: UserEmailConfirmation,
      meta: { redirectable: false }
    },
    {
      path: '/sign-in',
      name: 'UserAuthentication',
      component: UserAuthentication,
      meta: { redirectable: false }
    },
    {
      path: '/password/confirm/:token',
      name: 'UserConfirmPassword',
      component: UserConfirmPassword,
      meta: { redirectable: false }
    },
    {
      path: '/password/reset',
      name: 'UserResetPassword',
      component: UserResetPassword,
      meta: { redirectable: false }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: Analytics,
      meta: { redirectable: true }
    },
    {
      path: '/events',
      name: 'Events',
      component: Events,
      meta: { redirectable: true }
    },
    {
      path: '/events/:id/:tab?',
      name: 'Event',
      component: Event,
      meta: { redirectable: true }
    },
    {
      path: '/:page',
      name: 'StaticPage',
      component: StaticPage,
      meta: { redirectable: true }
    }
  ]
})
