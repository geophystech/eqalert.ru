import Vue from 'vue'
import Vuex from 'vuex'

import app from './app'
import user from './user'

import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app: app,
    user: user
  },
  plugins: [createPersistedState({
    filter: (mutation) => {
      switch (mutation.type) {
        case 'setCurrentTileProvider':
        case 'setPlateBoundaries':
        case 'setUser': return true
        default: return false
      }
    }
  })]
})
