<template>
  <div id="app">
    <b-container>
      <app-header></app-header>
      <app-navbar></app-navbar>
      <MobileAppAlert v-if="is_android" message="Мы сделали приложение для Android" :url="googlePlayUrl" />
      <MobileAppAlert v-if="is_iOS" message="Мы сделали приложение для iOS" :url="appStoreUrl" />
      <router-view></router-view>
      <app-footer></app-footer>
    </b-container>
  </div>
</template>

<script>
  import MobileAppAlert from '@/components/MobileAppAlert'
  import AppHeader from '@/components/AppHeader'
  import AppNavbar from '@/components/AppNavbar'
  import AppFooter from '@/components/AppFooter'
  import appSettings from '@/settings/app'

  export default {
    metaInfo: {
      htmlAttrs: {
        lang: 'ru'
      },
      meta: [
        { charset: 'utf-8' },
        { content: 'width=device-width, initial-scale=1', name: 'viewport' },
        { description: 'Eqalert.ru – информационная служба реального времени о землетрясениях, сейсмических воздействиях и опасности' },
        { keywords: 'землетрясение, интенсивность, сейсмическая опасность, сейсмические воздействия, пиковые ускорения грунта, ' +
            'сейсмический мониторинг, pga, msk64, информирование о землетрясении, эпицентр, гипоцентр, ' +
            'магнитуда, механизм очага, тензор момента, архив' }
      ],
      title: 'Главная',
      titleTemplate: '%s | EQA!ert'
    },
    name: 'app',
    components: {
      AppHeader,
      AppNavbar,
      AppFooter,
      MobileAppAlert
    },
    data() {
      return {
        googlePlayUrl: appSettings.mobileAppUrls.googlePlay,
        appStoreUrl: appSettings.mobileAppUrls.appStore
      }
    },
    created() {
      this.fetchSystemInfo()
    },
    methods: {
      fetchPlateBoundaries: function() {
        this.$http.get('/static/json/plate_boundaries.geo.json')
          .then(response => { this.$store.dispatch('setPlateBoundaries', response.data) })
          .catch(error => { console.log(error) })
      },
      fetchSystemInfo: function() {
        this.$http.get(this.$root.$options.settings.api.endpointSystemInfo)
          .then(response => {
            (data => {
              this.$store.dispatch('setMsk64ConfigVersion', data.msk64Config.data.config_version)
              this.$store.dispatch('setSrssDBVersion', data.srssCoreConfig.data.db_version)
              this.$store.dispatch('setTotalEventsCount', data.counters.reports)
            })(response.data.data)
          })
          .catch(error => { console.log(error) })
      }
    },
    mounted() {
      setInterval(() => { this.fetchSystemInfo() }, 30000)
      this.fetchPlateBoundaries()
    },
    computed: {
      is_android: function() {
        return this.$root.onMobile && /Android/i.test(navigator.userAgent)
          && !/Windows\s+Phone/i.test(navigator.userAgent)
      },
      is_iOS: function() {
        return this.$root.onMobile && /iPad|iPhone|iPod/i.test(navigator.userAgent)
          && !/Windows\s+Phone/i.test(navigator.userAgent)
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/main';
</style>
