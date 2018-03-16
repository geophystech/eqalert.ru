import { axiosSetAuthorizationHeaders, axiosRemoveAuthorizationHeaders } from '../../helpers/axios'

const axiosAuthorizationHeaders = store => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case 'authorizeUser':
        axiosSetAuthorizationHeaders()
        break
      case 'unauthorizeUser':
        axiosRemoveAuthorizationHeaders()
        break
    }
  })
}

export default axiosAuthorizationHeaders
