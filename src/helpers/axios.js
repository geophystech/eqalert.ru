import store from '../store'
import axios from 'axios'

import ApiSettings from '../settings/api.js'

export function axiosSetAuthorizationHeaders() {
  const apiSettings = new ApiSettings()

  // Set axios authorization headers.
  const apiToken = store.getters.user.accessToken
  const apiType = apiSettings.authorizationType

  if (apiToken) axios.defaults.headers.common['Authorization'] = `${apiType} ${apiToken}`
}

export function axiosRemoveAuthorizationHeaders() {
  delete axios.defaults.headers.common['Authorization']
}
