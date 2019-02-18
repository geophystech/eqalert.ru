
import moment from 'moment'

import { dateTimeDiff } from '@/helpers/datetime'

function authDuration(authDate)
{
  let diff = dateTimeDiff(moment(), moment(authDate))

  return ['months', 'days', 'hours', 'minutes'].map(it => {
    return (diff[it] > 0) ? `${diff[it]} ${it}` : false
  }).filter(it => !!it).join(' ')
}

const userActivity = store => {

  store.subscribe((mutation, state) => {

    let user = store.getters.user

    if(!user.authenticated) {
      return
    }

    let duration = moment.duration(moment().diff(moment(user.authDate)))
    let rememberMe = user.rememberMe

    if(mutation.type === 'idleVue/IDLE_CHANGED')
    {
      console.group('mutation')
      // console.log('Mutation type: ', mutation.type)
      console.log('Auth duration: ', authDuration(user.authDate))
      console.log('Payload: ', mutation.payload)
      console.log('isIdle: ', store.state.idleVue.isIdle)
      console.groupEnd()
    }

    if (mutation.type === 'idleVue/IDLE_CHANGED' && mutation.payload
      && ((rememberMe && duration.asDays() >= 14) || (!rememberMe && duration.asHours() >= 24))
    ) {
      store.dispatch('signOut')
      location.reload()
    }

  })

}

export default userActivity
