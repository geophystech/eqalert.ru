import Vue from 'vue'
import Toasted from 'vue-toasted'

export default ({ route, isHMR }) => {
  if (isHMR) {
    return
  }
  Vue.use(Toasted, {
    route,
    className: 'toast-message',
    iconPack: 'fontawesome',
    position: 'top-center',
    theme: 'primary',
    duration: 5000
  })
}
