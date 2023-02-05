<template>
  <b-container>
    <AppHeader/>
    <AppNavbar/>
    <AppMobileAlert v-if="is_android" message="Мы сделали приложение для Android" :url="googlePlayUrl" />
    <AppMobileAlert v-if="is_iOS" message="Мы сделали приложение для iOS" :url="appStoreUrl" />
    <Nuxt />
    <AppFooter/>
  </b-container>
</template>

<script>
import appSettings from '@/settings/app'
import apiSettings from '@/settings/api'
import {translateScale} from '@/helpers/scale'

export default {
  head() {
    return {
      meta: [
        { charset: 'utf-8' },
        { content: 'width=device-width, initial-scale=1', name: 'viewport' },
        { description: 'Eqalert.ru – информационная служба реального времени о землетрясениях, сейсмических воздействиях и опасности' },
        { keywords: 'землетрясение, интенсивность, сейсмическая опасность, сейсмические воздействия, пиковые ускорения грунта, ' +
            'сейсмический мониторинг, pga, msk64, информирование о землетрясении, эпицентр, гипоцентр, ' +
            'магнитуда, механизм очага, тензор момента, архив' }
      ],
      title: 'EQA!ert'
    }
  },
  data() {
    return {
      googlePlayUrl: appSettings.mobileAppUrls.googlePlay,
      appStoreUrl: appSettings.mobileAppUrls.appStore
    }
  },
  created() {
    if (process.client) {
      translateScale();
    }
    this.fetchSystemInfo()
  },
  methods: {
    fetchPlateBoundaries: function() {
      // /static/ ----> /
      this.$axios.get('/json/plate_boundaries.geo.json').then(response => {
        this.$store.dispatch('app/setPlateBoundaries', response.data)
      })
    },
    fetchSystemInfo: function() {
      this.$axios.get(apiSettings.endpointSystemInfo).then(response => {
        const data = response.data.data
        this.$store.dispatch('app/setMsk64ConfigVersion', data.msk64Config.data.config_version)
        this.$store.dispatch('app/setSrssDBVersion', data.srssCoreConfig.data.db_version)
        this.$store.dispatch('app/setTotalEventsCount', data.counters.reports)
      })
    }
  },
  mounted() {
    if (this.$route.fullPath.includes('/#/')) {
      this.$router.push(this.$route.fullPath.substring(2))
    }
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
@import 'assets/scss/main';
</style>
