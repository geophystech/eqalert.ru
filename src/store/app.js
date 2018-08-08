export default {
  state: {
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
    currentTileProvider: state => {
      return state.currentTileProvider
    },
    msk64ConfigVersion: state => { return state.msk64Config.configVersion },
    pgaConfigVersion: state => { return state.pgaConfig.configVersion },
    plateBoundaries: state => { return state.plateBoundaries },
    srssDBVersion: state => { return state.srssCoreConfig.dbVersion },
    totalEventsCount: state => { return state.counters.totalEvents }
  },
  mutations: {
    setCurrentTileProvider(state, { key, value }) {
      state[key] = value
    },
    setPlateBoundaries(state, { key, value }) {
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
        commit('setCurrentTileProvider', { key: 'currentTileProvider', value: provider })
      }
    },
    setPlateBoundaries({ commit, state }, value) {
      if (value !== state.plateBoundaries) {
        commit('setPlateBoundaries', { key: 'plateBoundaries', value: value })
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
  }
}
