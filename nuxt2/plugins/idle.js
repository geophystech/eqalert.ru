import Vue from 'vue'
import IdleVue from 'idle-vue'

export default ({ store, isHMR }) => {
  if (isHMR) {
    return
  }
  Vue.use(IdleVue, {
    startAtIdle: true,
    idleTime: 600000,
    store
  })
}
