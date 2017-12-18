// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import api from './api.js'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)

// Set axios authorization headers.
const apiToken = store.getters.apiAuthorizationToken
const apiType = api.authorizationType

if (apiToken) axios.defaults.headers.common['Authorization'] = `${apiType} ${apiToken}`

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  api: api,
  template: '<App/>',
  components: { App }
})
