// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import ApiSettings from './settings/api.js'
import App from './App'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import EventsSettings from './settings/events.js'
import IdleVue from 'idle-vue'
import moment from 'moment'
import router from './router'
import StationsSettings from './settings/stations.js'
import store from './store'
import Toasted from 'vue-toasted'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueAxios from 'vue-axios'
import VueMoment from 'vue-moment'
import VueYandexMetrika from 'vue-yandex-metrika'

import { axiosAddRefreshTokenInterceptor, axiosSetAuthorizationHeaders } from './helpers/axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'moment/locale/ru'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueAxios, axios)

Vue.use(IdleVue, {
  idleTime: 600000,
  startAtIdle: true,
  store
})

Vue.use(Toasted, {
  router,
  className: 'toast-message',
  duration: 5000,
  iconPack: 'fontawesome',
  position: 'top-center',
  theme: 'primary'
})

Vue.use(VueAnalytics, {
  id: 'UA-47326418-4',
  router,
  autoTracking: {
    skipSamePath: true
  },
  debug: {
    sendHitTask: process.env.NODE_ENV === 'production'
  }
})

Vue.use(VueMoment, {
  moment
})

Vue.use(VueYandexMetrika, {
  id: 36378850,
  router: router,
  env: process.env.NODE_ENV
})

axiosSetAuthorizationHeaders()
axiosAddRefreshTokenInterceptor()

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  settings: {
    api: new ApiSettings(),
    events: EventsSettings,
    stations: StationsSettings
  },
  template: '<App/>',
  components: { App }
})
