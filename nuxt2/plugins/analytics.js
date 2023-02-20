import Vue from 'vue'
import VueAnalytics from 'vue-analytics'

export default ({ route, isHMR }) => {
  if (isHMR) {
    return
  }
  Vue.use(VueAnalytics, {
    id: 'UA-47326418-4',
    route,
    autoTracking: {
      skipSamePath: true
    },
    debug: {
      sendHitTask: process.env.NODE_ENV === 'production'
    }
  })
}
