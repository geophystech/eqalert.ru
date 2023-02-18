import createPersistedState from 'vuex-persistedstate'

export default ({ store, isHMR, $config }) => {
  if (isHMR) return
  if (process.browser) {
    createPersistedState({
      key: $config.NAME_SPACE,
      filter: (mutation) => {

        switch (mutation.type)
        {
          case 'app/setCurrentTileProvider':
          case 'app/setPlateBoundaries':
          case 'user/unauthenticateUser':
          case 'user/authenticateUser':
            return true

          default:
            return false
        }

      }
    })(store)
  }
}
