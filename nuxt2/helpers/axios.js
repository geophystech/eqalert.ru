import {refreshToken} from '@/helpers/auth'
import apiSettings from '@/settings/api'

export function axiosRemoveAuthorizationHeaders(axios) {
  delete axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders(axios, accessToken)
{
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `${apiSettings.authorizationType} ${accessToken}`
  }
}

export function axiosAddRefreshTokenInterceptor(axios, store)
{
  const axiosResponseInterceptor = axios.interceptors.response.use(

    undefined,

    error => {

      let errorResponse = error.response || {}

      if(
        errorResponse.status === 401
        && apiSettings.endpointUserAuthentication !== errorResponse.config.url
        && apiSettings.endpointUserRefreshToken !== errorResponse.config.url
      ) {

        axios.interceptors.response.eject(axiosResponseInterceptor)

        return refreshToken(store.getters['user/user'].refreshToken, store, axios)

          .then(response => {

            errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
            axiosSetAuthorizationHeaders(axios, response.data.access_token)
            axiosAddRefreshTokenInterceptor(axios, store)

            return axios(errorResponse.config)

          })

          .catch(error => {

            store.dispatch('user/unauthenticateUser')
            axiosAddRefreshTokenInterceptor(axios, store)
            return Promise.reject(error)

          })

      }

      return Promise.reject(error)

    }
  )
}
