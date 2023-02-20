import {
  authTimeoutCheck
} from '@/helpers/auth'

const userActivity = (store) => {
  store.subscribe((mutation) => {
    if(mutation.type === 'idleVue/IDLE_CHANGED' && mutation.payload) {
      authTimeoutCheck(store, store.$moment)
    }
  })

}

export default userActivity
