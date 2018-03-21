export default {
  state: {
    authenticated: false,
    accessToken: null,
    refreshToken: null,
    rememberMe: false
  },
  getters: {
    user: state => {
      return {
        authenticated: state.authenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe
      }
    }
  },
  mutations: {
    authenticateUser(state, values) {
      state.authenticated = true
      state.accessToken = values.accessToken
      state.refreshToken = values.refreshToken
      state.rememberMe = values.rememberMe
    },
    unauthenticateUser(state) {
      state.authenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.rememberMe = null
    }
  },
  actions: {
    authenticateUser({ commit, state }, values) {
      commit('authenticateUser', {
        accessToken: values.accessToken,
        refreshToken: values.refreshToken,
        rememberMe: values.rememberMe
      })
    },
    unauthenticateUser({ commit, state }) {
      commit('unauthenticateUser')
    },
    signOut({ commit, state }) {
      commit('unauthenticateUser')
    }
  }
}
