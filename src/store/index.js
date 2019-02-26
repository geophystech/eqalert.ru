import Vue from 'vue'
import Vuex from 'vuex'

import requests from './requests'
import user from './user'
import app from './app'

import axiosAuthorizationHeaders from './plugins/axios'
import createPersistedState from 'vuex-persistedstate'
import userActivity from './plugins/user_activity'

Vue.use(Vuex)

export default new Vuex.Store({

  modules: {
    requests: requests,
    user: user,
    app: app
  },

  plugins: [

    axiosAuthorizationHeaders,

    createPersistedState({

      filter: (mutation) => {

        switch (mutation.type)
        {
          case 'setCurrentTileProvider':
          case 'setPlateBoundaries':
          case 'unauthenticateUser':
          case 'authenticateUser':
            return true

          default:
            return false
        }

      },

      key: 'eqalert.ru'

    }),

    userActivity

  ]

})
