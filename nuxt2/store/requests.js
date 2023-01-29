export default {
  state: {
    locked: false
  },
  getters: {
    lockedRequests: state => {
      return state.locked
    }
  },
  mutations: {
    lockRequests(state) {
      state.locked = true
    },
    unlockRequests(state) {
      state.locked = false
    }
  },
  actions: {
    lockRequests({ commit, state }) {
      commit('lockRequests')
    },
    unlockRequests({ commit, state }) {
      commit('unlockRequests')
    }
  }
}
