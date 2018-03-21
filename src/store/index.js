import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import requests from './requests'
import user from './user'

import createPersistedState from 'vuex-persistedstate'
import axiosAuthorizationHeaders from './plugins/axios'
import userActivity from './plugins/user_activity'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: app,
    requests: requests,
    user: user
  },
  plugins: [axiosAuthorizationHeaders, createPersistedState({
    filter: (mutation) => {
      switch (mutation.type) {
        case 'setCurrentTileProvider':
        case 'setPlateBoundaries':
        case 'authenticateUser':
        case 'unauthenticateUser': return true
        default: return false
      }
    },
    key: 'eqalert.ru'
  }), userActivity]
})
