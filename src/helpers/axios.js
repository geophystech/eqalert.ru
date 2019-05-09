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

export function axiosAddRefreshTokenInterceptor()
{
  const axiosResponseInterceptor = axios.interceptors.response.use(

    undefined,

    error => {

      let errorResponse = error.response || {}

      if(errorResponse.status === 401
        && apiSettings.endpointUserAuthentication !== errorResponse.config.url
        && apiSettings.endpointUserRefreshToken !== errorResponse.config.url
      ) {

        axios.interceptors.response.eject(axiosResponseInterceptor)

        return refreshToken(store.getters.user.refreshToken)

          .then(response => {

            errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
            axiosSetAuthorizationHeaders(response.data.access_token)
            axiosAddRefreshTokenInterceptor()

            return axios(errorResponse.config)

          })

          .catch(error => {

            store.dispatch('unauthenticateUser')
            axiosAddRefreshTokenInterceptor()
            return Promise.reject(error)

          })

      }

      return Promise.reject(error)

    }
  )
}
