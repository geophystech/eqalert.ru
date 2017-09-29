import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentTileProvider: ''
  },
  getters: {
    currentTileProvider: state => {
      return state.currentTileProvider
    }
  },
  mutations: {
    set (state, { type, value }) {
      state[type] = value
    }
  },
  actions: {
    setCurrentTileProvider ({ commit, state }, provider) {
      if (provider !== state.currentTileProvider) {
        commit('set', { type: 'currentTileProvider', value: provider })
      }
    }
  },
  plugins: [createPersistedState()]
})
