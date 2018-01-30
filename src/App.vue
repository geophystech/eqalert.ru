<template>
  <div id="app">
    <b-container>
      <app-header></app-header>
      <app-navbar></app-navbar>

      <router-view></router-view>

      <app-footer></app-footer>
    </b-container>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppNavbar,
    AppFooter
  },
  created() {
    this.fetchSystemInfo()
  },
  methods: {
    fetchPlateBoundaries: function() {
      this.$http.get('/static/json/plate_boundaries.geojson')
        .then(response => { this.$store.dispatch('setPlateBoundaries', response.data) })
        .catch(error => { console.log(error) })
    },
    fetchSystemInfo: function() {
      this.$http.get(this.$root.$options.settings.api.endpointSystemInfo)
      .then(response => {
        this.$store.dispatch('setTotalEventsCount', response.data.data.counters.reports)
        this.$store.dispatch('setMsk64ConfigVersion', response.data.data.msk64Config.data.config_version)
        this.$store.dispatch('setPgaConfigVersion', response.data.data.pgaConfig.data.config_version)
        this.$store.dispatch('setSrssDBVersion', response.data.data.srssCoreConfig.data.db_version)
      })
      .catch(e => { this.errors.push(e) })
    }
  },
  mounted() {
    setInterval(() => { this.fetchSystemInfo() }, 30000)
    this.fetchPlateBoundaries()
  }
}
</script>
