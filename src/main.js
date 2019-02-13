// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import apiSettings from '@/settings/api.js'
import App from '@/App'
import axios from 'axios'
import BootstrapVue from 'bootstrap-vue'
import EventsSettings from '@/settings/events.js'
import IdleVue from 'idle-vue'
import moment from 'moment'
import router from '@/router'
import stationsSettings from '@/settings/stations.js'
import store from '@/store'
import Toasted from 'vue-toasted'
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import VueAxios from 'vue-axios'
import VueMoment from 'vue-moment'
import VueYandexMetrika from 'vue-yandex-metrika'

import { axiosAddRefreshTokenInterceptor, axiosSetAuthorizationHeaders } from '@/helpers/axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vue-toasted/dist/vue-toasted.min.css'
import 'moment/locale/ru'

// Leaflet

import 'leaflet/dist/leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet-spin/example/spin/dist/spin'
import 'leaflet-spin/leaflet.spin'

import 'leaflet-fullscreen/dist/Leaflet.fullscreen'
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'

import 'leaflet-dvf/dist/leaflet-dvf'
import 'leaflet-dvf/dist/css/dvf.css'

import 'leaflet-zoomhome/dist/leaflet.zoomhome'

import 'leaflet.markercluster/dist/leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

import 'leaflet.gridlayer.googlemutant/Leaflet.GoogleMutant'
import 'leaflet-yandex-tile/dist/leaflet.yandex-tile'

import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.min'
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.min.css'

import 'font-awesome/css/font-awesome.min.css'

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
    api: apiSettings,
    events: EventsSettings,
    stations: stationsSettings
  },
  template: '<App/>',
  components: { App },
  computed: {
    onMobile: function() {
      return screen.width < 768
    }
  }
})
