import axiosSetAuthorizationHeaders from '../../helpers/axios'

const axiosAuthorizationHeaders = store => {
  store.subscribe((mutation, state) => {
    if (mutation.type === 'authorizeUser') {
      axiosSetAuthorizationHeaders()
    }
  })
}

export default axiosAuthorizationHeaders
