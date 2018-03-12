export default {
  state: {
    authorized: false,
    accessToken: null,
    refreshToken: null
  },
  getters: {
    user: state => {
      return {
        authorized: state.authorized,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      }
    }
  },
  mutations: {
    authorizeUser(state, values) {
      state.authorized = true
      state.accessToken = values.accessToken
      state.refreshToken = values.refreshToken
    },
    unauthorizeUser(state, values) {
      state.authorized = false
      state.accessToken = null
      state.refreshToken = null
    }
  },
  actions: {
    authorizeUser({ commit, state }, values) {
      commit('authorizeUser', {
        accessToken: values.accessToken,
        refreshToken: values.refreshToken
      })
    },
    signOut({ commit, state }) {
      commit('unauthorizeUser')
    }
  }
}
