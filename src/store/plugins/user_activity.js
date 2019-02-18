
import moment from 'moment'

function authDration(store) {
  return Math.ceil(moment.duration(moment().diff(moment(store.getters.user.authDate))).as('minutes'))
}

const userActivity = store => {

  store.subscribe((mutation, state) => {

    console.log('userActivity: ',
      // moment(store.getters.user.authDate).format('DD.MM.YYYY HH:mm:ss'),
      authDration(store), 'minutes',
      mutation, store, state
    )

    // Force user to sign out if activity is idle AND user has not set `Remember me` option on authentication.
    if (mutation.type === 'idleVue/IDLE_CHANGED' &&
      mutation.payload &&
      store.getters.user.authenticated &&
      !store.getters.user.rememberMe
    ) {

      console.log('Force signOut: ',
        authDration(store), 'minutes',
        mutation, store, state
      )

      store.dispatch('signOut')
      // location.reload()

    }

  })

}

export default userActivity
