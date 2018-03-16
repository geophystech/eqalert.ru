const userActivity = store => {
  store.subscribe((mutation, state) => {
    // Force user to sign out if activity is idle AND user has not set `Remember me` option on authorization.
    if (mutation.type === 'idleVue/IDLE_CHANGED' &&
        mutation.payload &&
        store.getters.user.authorized &&
        !store.getters.user.rememberMe) {
      store.dispatch('signOut')
      location.reload()
    }
  })
}

export default userActivity
