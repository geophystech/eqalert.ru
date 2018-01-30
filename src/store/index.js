import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: {
      authorizationToken: ''
    },
    counters: {
      totalEvents: 0
    },
    currentTileProvider: '',
    msk64Config: {
      configVersion: ''
    },
    pgaConfig: {
      configVersion: ''
    },
    plateBoundaries: [],
    srssCoreConfig: {
      dbVersion: ''
    }
  },
  getters: {
    apiAuthorizationToken: state => { return state.api.authorizationToken },
    currentTileProvider: state => { return state.currentTileProvider },
    chartDataset: () => {
      return {
        datasets: [{
          label: '',
          data: [],
          fill: true,
          lineTension: 0.1,
          backgroundColor: 'rgba(51,122,183,0.4)',
          borderColor: 'rgba(51,122,183,1)',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: 'rgba(51,122,183,1)',
          pointBackgroundColor: 'rgba(51,122,183,1)',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgba(51,122,183,1)',
          pointHoverBorderColor: 'rgba(51,122,183,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10
        }],
        labels: []
      }
    },
    msk64ConfigVersion: state => { return state.msk64Config.configVersion },
    pgaConfigVersion: state => { return state.pgaConfig.configVersion },
    plateBoundaries: state => { return state.plateBoundaries },
    srssDBVersion: state => { return state.srssCoreConfig.dbVersion },
    totalEventsCount: state => { return state.counters.totalEvents }
  },
  mutations: {
    set(state, { key, value }) {
      state[key] = value
    },
    setCounter(state, { key, value }) {
      state.counters[key] = value
    },
    setMsk64Config(state, { key, value }) {
      state.msk64Config[key] = value
    },
    setPgaConfig(state, { key, value }) {
      state.pgaConfig[key] = value
    },
    setSrssDBVersion(state, { key, value }) {
      state.srssCoreConfig[key] = value
    }
  },
  actions: {
    setCurrentTileProvider({ commit, state }, provider) {
      if (provider !== state.currentTileProvider) {
        commit('set', { key: 'currentTileProvider', value: provider })
      }
    },
    setPlateBoundaries({ commit, state }, value) {
      if (value !== state.plateBoundaries) {
        commit('set', { key: 'plateBoundaries', value: value })
      }
    },
    setTotalEventsCount({ commit }, value) {
      commit('setCounter', { key: 'totalEvents', value: value })
    },
    setMsk64ConfigVersion({ commit }, value) {
      commit('setMsk64Config', { key: 'configVersion', value: value })
    },
    setPgaConfigVersion({ commit }, value) {
      commit('setPgaConfig', { key: 'configVersion', value: value })
    },
    setSrssDBVersion({ commit }, value) {
      commit('setSrssDBVersion', { key: 'dbVersion', value: value })
    }
  },
  plugins: [createPersistedState({
    filter: (mutation) => {
      // Store in localStorage only currentTileProvider or plateBoundaries.
      switch (mutation.payload.key) {
        case 'currentTileProvider':
        case 'plateBoundaries': return true
        default: return false
      }
    }
  })]
})
