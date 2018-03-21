import { axiosSetAuthorizationHeaders, axiosRemoveAuthorizationHeaders } from '../../helpers/axios'

const axiosAuthorizationHeaders = store => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'authenticateUser':
        axiosSetAuthorizationHeaders()
        break
      case 'lockRequests':
      case 'unauthenticateUser':
        axiosRemoveAuthorizationHeaders()
        break
    }
  })
}

export default axiosAuthorizationHeaders
