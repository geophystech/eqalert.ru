<template>
  <b-container>
    <AppHeader/>
    <ClientOnly>
      <AppNavbar/>
      <AppMobileAlert v-if="is_android" message="Мы сделали приложение для Android" :url="googlePlayUrl" />
      <AppMobileAlert v-if="is_iOS" message="Мы сделали приложение для iOS" :url="appStoreUrl" />
    </ClientOnly>
    <Nuxt />
    <AppFooter/>
  </b-container>
</template>

<script>
import appSettings from '@/settings/app'
import { translateScale } from '@/helpers/scale'
import { axiosAddRefreshTokenInterceptor, axiosSetAuthorizationHeaders } from '@/helpers/axios'
import { authTimeoutCheck } from '@/helpers/auth'
import onMobile from "@/mixins/onMobile"
import plateBoundariesGeo from "@/config/plate_boundaries.geo"

export default {
  mixins: [onMobile],
  data() {
    return {
      googlePlayUrl: appSettings.mobileAppUrls.googlePlay,
      appStoreUrl: appSettings.mobileAppUrls.appStore
    }
  },
  created() {
    if (process.browser) {
      axiosSetAuthorizationHeaders(this.$axios, this.$store.getters['user/user'].accessToken)
      axiosAddRefreshTokenInterceptor(this.$axios, this.$store, this.$api)
      authTimeoutCheck(this.$store, this.$moment)
      translateScale()
    }
    this.fetchSystemInfo()
  },
  methods: {
    fetchPlateBoundaries: function() {
        this.$store.dispatch('app/setPlateBoundaries', plateBoundariesGeo)
    },
    fetchSystemInfo: function() {
      this.$axios.get(this.$api.endpointSystemInfo).then(response => {
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
      return this.onMobile && /Android/i.test(navigator.userAgent)
        && !/Windows\s+Phone/i.test(navigator.userAgent)
    },
    is_iOS: function() {
      return this.onMobile && /iPad|iPhone|iPod/i.test(navigator.userAgent)
        && !/Windows\s+Phone/i.test(navigator.userAgent)
    }
  }
}
</script>

<style lang="scss">
@import 'assets/scss/main';
</style>
