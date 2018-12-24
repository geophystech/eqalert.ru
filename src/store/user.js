export default {
  state: {
    authenticated: false,
    accessToken: null,
    refreshToken: null,
    rememberMe: false,
    permissions: {}
  },
  getters: {
    user: state => {
      return {
        authenticated: state.authenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        rememberMe: state.rememberMe,
        permissions: state.permissions
      }
    }
  },
  mutations: {
    authenticateUser(state, values) {
      state.authenticated = true
      state.accessToken = values.accessToken
      state.refreshToken = values.refreshToken
      state.rememberMe = values.rememberMe
      state.permissions = values.permissions
    },
    unauthenticateUser(state) {
      state.authenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.rememberMe = null
      state.permissions = {}
    }
  },
  actions: {
    authenticateUser({ commit, state }, values) {
      commit('authenticateUser', {
        accessToken: values.accessToken,
        refreshToken: values.refreshToken,
        rememberMe: values.rememberMe,
        permissions: values.permissions
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
