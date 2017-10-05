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
    },
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
  plugins: [createPersistedState({
    filter: (mutation) => {
      // Store in localStorage only currentTileProvider
      if (mutation.payload.type === 'currentTileProvider') return true
    }
  })]
})
