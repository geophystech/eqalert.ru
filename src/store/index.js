import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import user from './user'

import createPersistedState from 'vuex-persistedstate'
import axiosAuthorizationHeaders from './plugins/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: app,
    user: user
  },
  plugins: [axiosAuthorizationHeaders, createPersistedState({
    filter: (mutation) => {
      switch (mutation.type) {
        case 'setCurrentTileProvider':
        case 'setPlateBoundaries':
        case 'authorizeUser':
        case 'unauthorizeUser': return true
        default: return false
      }
    }
  })]
})
