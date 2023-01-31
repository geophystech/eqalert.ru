import createPersistedState from 'vuex-persistedstate'

const NAME_SPACE = 'eqalert.ru'

export default ({ store, isHMR }) => {
  if (isHMR) return
  if (process.browser) {
    createPersistedState({
      key: NAME_SPACE,
      filter: (mutation) => {

        switch (mutation.type)
        {
          case 'setCurrentTileProvider':
          case 'setPlateBoundaries':
          case 'unauthenticateUser':
          case 'authenticateUser':
            return true

          default:
            return false
        }

      }
    })(store)
  }
}
