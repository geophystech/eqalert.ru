import moment from 'moment'

export default {
  state: {
    authenticated: false,
    accessToken: null,
    refreshToken: null,
    rememberMe: false,
    permissions: {},
    authDate: null
  },
  getters: {
    user: state => {
      return {
        authenticated: state.authenticated,
        refreshToken: state.refreshToken,
        accessToken: state.accessToken,
        permissions: state.permissions,
        rememberMe: state.rememberMe,
        authDate: state.authDate
      }
    }
  },
  mutations: {
    authenticateUser(state, values) {
      state.authDate = moment().format('YYYY-MM-DD HH:mm:ss')
      state.refreshToken = values.refreshToken
      state.accessToken = values.accessToken
      state.permissions = values.permissions
      state.rememberMe = values.rememberMe
      state.authenticated = true
    },
    unauthenticateUser(state) {
      state.authenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.rememberMe = null
      state.authDate = null
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
