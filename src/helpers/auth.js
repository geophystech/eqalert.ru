import {axiosSetAuthorizationHeaders} from '@/helpers/axios'
import apiSettings from '@/settings/api'
import store from '@/store'
import axios from 'axios'

/**
 *
 * @param {string} accessToken
 * @return {Promise<any>}
 * @private
 */
function _getUserPermissions(accessToken)
{
  return new Promise((resolve, reject) => {

    axiosSetAuthorizationHeaders(accessToken)

    axios.get(apiSettings.endpointUserRefreshScopes).then(resp => {

      let permissions = {}

      resp.data.data.forEach(permission => {
        permissions[permission.id] = permission.description
      })

      resolve(permissions)

    }).catch(error => {
      reject(error)
    })

  })

}

/**
 * @param {string} refreshToken
 * @return {Promise<any>}
 */
export function refreshToken(refreshToken)
{
  return new Promise((resolve, reject) => {

    axios.post(apiSettings.endpointUserRefreshToken, {'refresh_token': refreshToken})

      .then(authResp => {

        // Get permissions
        _getUserPermissions(authResp.data.access_token)

          .then(permissions => {

            // Время жизни токена в секундах
            // authResp.data.expires_in

            store.dispatch('authenticateUser', {
              rememberMe: store.getters.user.rememberMe,
              refreshToken: authResp.data.refresh_token,
              accessToken: authResp.data.access_token,
              permissions: permissions
            })

            resolve(authResp)

          })

          .catch(error => {
            reject(error)
          })

      })

      .catch(error => {
        reject(error)
      })

  })

}

/**
 *
 * @param {string} username
 * @param {string} password
 * @param {boolean} rememberMe
 * @return {Promise<any>}
 */
export function auth({username, password, rememberMe = false})
{
  return new Promise((resolve, reject) => {

    const payload = {
      username: username,
      password: password
    }

    axios.post(apiSettings.endpointUserAuthentication, payload)

      .then(authResp => {

        _getUserPermissions(authResp.data.access_token)

          .then(permissions => {

            // Время жизни токена в секундах
            // authResp.data.expires_in

            store.dispatch('authenticateUser', {
              refreshToken: authResp.data.refresh_token,
              accessToken: authResp.data.access_token,
              permissions: permissions,
              rememberMe: rememberMe
            })

            resolve(authResp)

          })

          .catch(error => {
            reject(error)
          })

      })

      .catch(error => {
        reject(error)
      })

  })

}

