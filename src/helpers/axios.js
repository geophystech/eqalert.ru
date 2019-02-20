import store from '@/store'
import axios from 'axios'

import {refreshToken} from '@/helpers/auth'
import apiSettings from '@/settings/api'

export function axiosRemoveAuthorizationHeaders() {
  delete axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders(accessToken = store.getters.user.accessToken)
{
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `${apiSettings.authorizationType} ${accessToken}`
  }
}

let _usedTokens = []

export function axiosAddRefreshTokenInterceptor()
{
  const axiosResponseInterceptor = axios.interceptors.response.use(undefined, error => {

    let errorResponse = error.response

    console.log('_usedTokens: ', _usedTokens)

    if(errorResponse.status === 401
      && apiSettings.endpointUserAuthentication !== errorResponse.config.url
      && apiSettings.endpointUserRefreshToken !== errorResponse.config.url
      && _usedTokens.indexOf(store.getters.user.refreshToken) === -1
    ) {

      axios.interceptors.response.eject(axiosResponseInterceptor)
      _usedTokens.push(store.getters.user.refreshToken)

      return refreshToken(store.getters.user.refreshToken)

        .then(response => {

          errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
          axiosAddRefreshTokenInterceptor()

          return axios(errorResponse.config)

        })

        .catch(error => {

          axiosAddRefreshTokenInterceptor()
          store.dispatch('unauthenticateUser')
          return Promise.reject(error)

        })
    }

    return Promise.reject(error)

  })
}
