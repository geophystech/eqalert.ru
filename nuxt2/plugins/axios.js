import {
  axiosSetAuthorizationHeaders,
  axiosRemoveAuthorizationHeaders
} from '@/helpers/axios'

const axiosAuthorizationHeaders = (store) => {
  store.subscribe((mutation) => {
    switch (mutation.type) {
      case 'user/authenticateUser':
        axiosSetAuthorizationHeaders(store.$axios, store.getters['user/user'].accessToken)
        break
      case 'requests/lockRequests':
      case 'user/unauthenticateUser':
        axiosRemoveAuthorizationHeaders(store.$axios)
        break
    }
  })
}

export default axiosAuthorizationHeaders
