import {
  axiosSetAuthorizationHeaders
} from '@/helpers/axios'

/**
 *
 * @param {string} accessToken
 * @param axios
 * @param $api
 * @return {Promise<any>}
 * @private
 */
async function _getUserPermissions(accessToken, axios, $api)
{
  return new Promise((resolve, reject) => {

    axios.get($api.endpointUserRefreshScopes).then(resp => {

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
 *
 * @type {Promise|null}
 * @private
 */
let _refreshTokenRequest = null

/**
 * @param {null} refreshToken
 * @param store
 * @param axios
 * @param $api
 * @return {Promise<any>}
 */
export async function refreshToken(refreshToken, store, axios, $api)
{
  return _refreshTokenRequest || (_refreshTokenRequest = new Promise((resolve, reject) => {

    axios.post($api.endpointUserRefreshToken, {'refresh_token': refreshToken})

      .then(authResp => {

        axiosSetAuthorizationHeaders(axios, authResp.data.access_token)

        // Get permissions
        _getUserPermissions(authResp.data.access_token, axios, $api)

          .then(permissions => {

            // Время жизни токена в секундах
            // authResp.data.expires_in

            store.dispatch('user/authenticateUser', {
              rememberMe: store.getters['user/user'].rememberMe,
              refreshToken: authResp.data.refresh_token,
              accessToken: authResp.data.access_token,
              permissions: permissions
            })

            _refreshTokenRequest = null
            resolve(authResp)

          })

          .catch(error => {
            _refreshTokenRequest = null
            reject(error)
          })

      })

      .catch(error => {
        _refreshTokenRequest = null
        reject(error)
      })

  }))

}

/**
 *
 * @param {string} username
 * @param {string} password
 * @param {boolean} rememberMe
 * @param store
 * @param axios
 * @param $api
 * @return {Promise<any>}
 */
export async function auth({username, password, rememberMe = false}, store, axios, $api)
{
  return new Promise((resolve, reject) => {

    const payload = {
      username: username,
      password: password
    }

    axios.post($api.endpointUserAuthentication, payload)

      .then(authResp => {

        axiosSetAuthorizationHeaders(axios, authResp.data.access_token)

        _getUserPermissions(authResp.data.access_token, axios, $api)

          .then(permissions => {

            // Время жизни токена в секундах
            // authResp.data.expires_in

            store.dispatch('user/authenticateUser', {
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

import authSettings from '@/settings/auth'
import {camelCase} from '@/helpers/string'

export function authTimeoutCheck(store, moment)
{
  let user = store.getters['user/user']

  if(!user.authenticated) {
    return
  }

  let duration = moment.duration(
    moment().diff(
      moment(
        user.authDate
      )
    )
  )
  let rememberMe = user.rememberMe

  let regexp = /^(\d+)\s+(minute|hour|day|month|year)s?$/i

  let match1 = regexp.exec(authSettings.duration.remember)
  let match2 = regexp.exec(authSettings.duration.default)

  if(!match1 || !match2) {
    throw new Error('Invalid duration')
  }

  let [, rememberVal, rememberFn] = match1
  let [, defaultVal, defaultFn] = match2

  rememberFn = camelCase(`as_${rememberFn}s`)
  defaultFn = camelCase(`as_${defaultFn}s`)

  if ((rememberMe && duration[rememberFn]() >= Number(rememberVal))
    || (!rememberMe && duration[defaultFn]() >= Number(defaultVal))
  ) {
    store.dispatch('user/signOut')
    location.replace('/')
  }
}
