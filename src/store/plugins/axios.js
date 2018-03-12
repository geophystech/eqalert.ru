import { axiosSetAuthorizationHeaders, axiosRemoveAuthorizationHeaders } from '../../helpers/axios'

const axiosAuthorizationHeaders = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'authorizeUser') {
      axiosSetAuthorizationHeaders()
    } else if (mutation.type === 'unauthorizeUser') {
      axiosRemoveAuthorizationHeaders()
    }
  })
}

export default axiosAuthorizationHeaders
