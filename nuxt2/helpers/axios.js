import {refreshToken} from '@/helpers/auth'
import apiSettings from '@/settings/api'

export function axiosRemoveAuthorizationHeaders() {
  delete this.$axios.defaults.headers.common['Authorization']
}

export function axiosSetAuthorizationHeaders(accessToken = this.$store.getters.user.accessToken)
{
  if (accessToken) {
    this.$axios.defaults.headers.common['Authorization'] = `${apiSettings.authorizationType} ${accessToken}`
  }
}

export function axiosAddRefreshTokenInterceptor()
{
  const axiosResponseInterceptor = this.$axios.interceptors.response.use(

    undefined,

    error => {

      let errorResponse = error.response || {}

      if(
        errorResponse.status === 401
        && apiSettings.endpointUserAuthentication !== errorResponse.config.url
        && apiSettings.endpointUserRefreshToken !== errorResponse.config.url
      ) {

        this.$axios.interceptors.response.eject(axiosResponseInterceptor)

        return refreshToken(this.$store.getters.user.refreshToken)

          .then(response => {

            errorResponse.config.headers['Authorization'] = `${apiSettings.authorizationType} ${response.data.access_token}`
            axiosSetAuthorizationHeaders(response.data.access_token)
            axiosAddRefreshTokenInterceptor()

            return this.$axios(errorResponse.config)

          })

          .catch(error => {

            this.$store.dispatch('user/unauthenticateUser')
            axiosAddRefreshTokenInterceptor()
            return Promise.reject(error)

          })

      }

      return Promise.reject(error)

    }
  )
}
