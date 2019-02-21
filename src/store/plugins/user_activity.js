import {authTimeoutChech} from '@/helpers/auth'

const userActivity = store => {

  store.subscribe((mutation, state) => {
    if(mutation.type === 'idleVue/IDLE_CHANGED' && mutation.payload) {
      authTimeoutChech(store)
    }
  })

}

export default userActivity
