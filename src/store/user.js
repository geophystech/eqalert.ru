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
    setUserAuthorized({ commit, state }, value) {
      commit('setUser', { key: 'authorized', value: value })
    },
    setUserTokens({ commit, state }, value) {
      commit('setUser', { key: 'token', value: value.token })
      commit('setUser', { key: 'refreshToken', value: value.refreshToken })
      commit('setUser', { key: 'authorized', value: true })
    }
  }
}
