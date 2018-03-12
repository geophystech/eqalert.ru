export default {
  state: {
    authorized: false,
    token: null,
    refreshToken: null
  },
  getters: {
    user: state => {
      return {
        authorized: state.authorized,
        token: state.token,
        refreshToken: state.refreshToken
      }
    }
  },
  mutations: {
    setUser(state, { key, value }) {
      state[key] = value
    }
  },
  actions: {
    authorizeUser({ commit, state }, value) {
      commit('setUser', { key: 'token', value: value.token })
      commit('setUser', { key: 'refreshToken', value: value.refreshToken })
      commit('setUser', { key: 'authorized', value: true })
    },
    signOut({ commit, state }) {
      commit('setUser', { key: 'token', value: null })
      commit('setUser', { key: 'refreshToken', value: null })
      commit('setUser', { key: 'authorized', value: false })
    }
  }
}
