// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import IdleVue from 'idle-vue'
import Toasted from 'vue-toasted'

import VueAnalytics from 'vue-analytics'
import VueYandexMetrika from 'vue-yandex-metrika'

import ApiSettings from './settings/api.js'
import EventsSettings from './settings/events.js'
import StationsSettings from './settings/stations.js'
import { axiosAddRefreshTokenInterceptor, axiosSetAuthorizationHeaders } from './helpers/axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(Toasted, {
  duration: 5000,
  iconPack: 'fontawesome',
  position: 'top-center'
})

Vue.use(IdleVue, {
  idleTime: 600000,
  startAtIdle: true,
  store
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
