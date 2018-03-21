import store from '../store'
import axios from 'axios'

import ApiSettings from '../settings/api.js'

export function axiosRemoveAuthorizationHeaders() {
  delete axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders() {
  const apiToken = store.getters.user.accessToken

  if (apiToken) {
    const apiSettings = new ApiSettings()
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

      if (errorResponse.status === 401) {
        axios.interceptors.response.eject(axiosResponseInterceptor)

        const apiSettings = new ApiSettings()

        return axios.post(apiSettings.endpointUserRefreshToken, {
          'refresh_token': store.getters.user.refreshToken
        }).then(response => {
          store.dispatch('authenticateUser', {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token,
            rememberMe: store.getters.user.rememberMe
          })

          const apiSettings = new ApiSettings()

          errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
          axiosAddRefreshTokenInterceptor()

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
