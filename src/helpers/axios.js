import store from '@/store'
import axios from 'axios'

import apiSettings from '@/settings/api.js'

export function axiosRemoveAuthorizationHeaders() {
  delete axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders() {
  const apiToken = store.getters.user.accessToken

  if (apiToken) {
    const apiType = apiSettings.authorizationType

    axios.defaults.headers.common['Authorization'] = `${apiType} ${apiToken}`
  }
}

export function axiosAddRefreshTokenInterceptor() {
  const axiosResponseInterceptor = axios.interceptors.response.use(
    response => {
      return response
    },
    error => {
      let errorResponse = error.response

      if (errorResponse.status === 401 && apiSettings.endpointUserAuthentication !== error.response.config.url) {
        axios.interceptors.response.eject(axiosResponseInterceptor)

        return axios.post(apiSettings.endpointUserRefreshToken, {
          'refresh_token': store.getters.user.refreshToken
        }).then(response => {

          this.$http.get(this.$root.$options.settings.api.endpointUserRefreshScopes, {
            headers: { Authorization: `${apiSettings.authorizationType} ${response.data.access_token}` }
          })
            .then(scopesResponse => {

              let permissions = {}

              scopesResponse.data.data.forEach(permission => {
                permissions[permission.id] = permission.description
              })

              store.dispatch('authenticateUser', {
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
                rememberMe: store.getters.user.rememberMe,
                permissions: permissions
              })

              errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
              axiosAddRefreshTokenInterceptor()

            })
            .catch(error => {
              console.log(error)
            })

          return axios(errorResponse.config)
        }).catch(error => {
          axiosAddRefreshTokenInterceptor()
          store.dispatch('unauthenticateUser')

          return Promise.reject(error)
        })
      }

      return Promise.reject(error)
    }
  )
}
