import '@/helpers/gtag'
import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app, isHMR }) => {
  if (isHMR) {
    return
  }
  Vue.use(VueGtag, {
    config: { id: 'G-RFF8MWHH6E' },
    appName: 'EQAlert',
    pageTrackerScreenviewEnabled: true
  }, app.router)
}
