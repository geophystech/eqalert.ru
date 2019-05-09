import {authTimeoutCheck} from '@/helpers/auth'

const userActivity = store => {

  store.subscribe((mutation, state) => {
    if(mutation.type === 'idleVue/IDLE_CHANGED' && mutation.payload) {
      authTimeoutCheck(store)
    }
  })

}

export default userActivity
