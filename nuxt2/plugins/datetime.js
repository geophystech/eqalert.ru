import Vue from 'vue'
import { Datetime } from 'vue-datetime'
import { Settings } from 'luxon'

export default ({ isHMR }) => {
  if (isHMR) {
    return
  }
  Settings.defaultLocale = 'ru'
  Vue.component('v-datetime', Datetime)
}
