import Vue from 'vue'
import VueYandexMetrika from 'vue-yandex-metrika'

export default ({ route, isHMR }) => {
  if (isHMR) {
    return
  }
  Vue.use(VueYandexMetrika, {
    id: 36378850,
    router: route,
    env: process.env.NODE_ENV
  })
}
