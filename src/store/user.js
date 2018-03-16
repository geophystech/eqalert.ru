export default {
  state: {
    authorized: false,
    accessToken: null,
    refreshToken: null,
    rememberMe: false
  },
  getters: {
    user: state => {
      return {
        authorized: state.authorized,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe
      }
    }
  },
  mutations: {
    authorizeUser(state, values) {
      state.authorized = true
      state.accessToken = values.accessToken
      state.refreshToken = values.refreshToken
      state.rememberMe = values.rememberMe
    },
    unauthorizeUser(state, values) {
      state.authorized = false
      state.accessToken = null
      state.refreshToken = null
      state.rememberMe = null
    }
  },
  actions: {
    authorizeUser({ commit, state }, values) {
      commit('authorizeUser', {
        accessToken: values.accessToken,
        refreshToken: values.refreshToken,
        rememberMe: values.rememberMe
      })
    },
    signOut({ commit, state }) {
      commit('unauthorizeUser')
    }
  }
}
