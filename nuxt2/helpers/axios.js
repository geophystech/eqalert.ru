import {refreshToken} from '@/helpers/auth'

export function axiosRemoveAuthorizationHeaders(axios) {
  delete axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders(axios, accessToken)
{
  if (accessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  }
}

export function axiosAddRefreshTokenInterceptor(axios, store, $api)
{
  const axiosResponseInterceptor = axios.interceptors.response.use(

    undefined,

    error => {

      let errorResponse = error.response || {}

      if(
        errorResponse.status === 401
        && $api.endpointUserAuthentication !== errorResponse.config.url
        && $api.endpointUserRefreshToken !== errorResponse.config.url
      ) {

        axios.interceptors.response.eject(axiosResponseInterceptor)

        return refreshToken(store.getters['user/user'].refreshToken, store, axios, $api)

          .then(response => {

            errorResponse.config.headers['Authorization'] = `${$api.authorizationType} ${response.data.access_token}`
            axiosSetAuthorizationHeaders(axios, response.data.access_token)
            axiosAddRefreshTokenInterceptor(axios, store, $api)

            return axios(errorResponse.config)

          })

          .catch(error => {

            store.dispatch('user/unauthenticateUser')
            axiosAddRefreshTokenInterceptor(axios, store, $api)
            return Promise.reject(error)

          })

      }

      return Promise.reject(error)

    }
  )
}
