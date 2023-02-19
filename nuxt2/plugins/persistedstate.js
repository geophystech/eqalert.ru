import createPersistedState from 'vuex-persistedstate'

export default ({ store, isHMR, $config }) => {
  const NAME_SPACE = $config.NAME_SPACE || 'eqalert.ru'
  if (isHMR) return
  if (process.browser) {
    createPersistedState({
      key: NAME_SPACE,
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
