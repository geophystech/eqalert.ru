import store from '../store'
import axios from 'axios'

import ApiSettings from '../settings/api.js'

export function axiosSetAuthorizationHeaders() {
  const apiToken = store.getters.user.accessToken

  if (apiToken) {
    const apiSettings = new ApiSettings()
    const apiType = apiSettings.authorizationType

    axios.defaults.headers.common['Authorization'] = `${apiType} ${apiToken}`
  }
}

export function axiosRemoveAuthorizationHeaders() {
  delete axios.defaults.headers.common['Authorization']
}
