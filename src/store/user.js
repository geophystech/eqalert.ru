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
      state.authDate = moment().format(moment.HTML5_FMT.DATETIME_LOCAL_SECONDS)
      state.refreshToken = values.refreshToken
      state.accessToken = values.accessToken
      state.permissions = values.permissions
      state.rememberMe = values.rememberMe
      state.authenticated = true
    },
    unauthenticateUser(state) {
      state.authenticated = false
      state.refreshToken = null
      state.accessToken = null
      state.rememberMe = null
      state.authDate = null
      state.permissions = {}
    }
  },
  actions: {
    authenticateUser({ commit, state }, values) {
      commit('authenticateUser', {
        refreshToken: values.refreshToken,
        accessToken: values.accessToken,
        permissions: values.permissions,
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
