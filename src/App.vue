<template>
  <div id="app">
    <b-container>
      <app-header></app-header>
      <app-navbar></app-navbar>

      <b-row v-if="is_android" class="mobile-app-alert">
        <b-col cols="12">
          <b-alert variant="danger" show dismissible>
            <a href="https://play.google.com/store/apps/details?id=ru.geophystech.eqalert"
               class="alert-link">Мы сделали приложение для Android</a>
          </b-alert>
        </b-col>
      </b-row>

      <b-row v-if="is_iOs" class="mobile-app-alert">
        <b-col cols="12">
          <b-alert variant="danger" show dismissible>
            <a href="https://itunes.apple.com/ru/app/eqalert/id1448087679"
               class="alert-link">Мы сделали приложение для iOs</a>
          </b-alert>
        </b-col>
      </b-row>

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
    AppFooter
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
    is_iOs: function() {
      return this.$root.onMobile && /iPad|iPhone|iPod/i.test(navigator.userAgent)
        && !/Windows\s+Phone/i.test(navigator.userAgent)
    }
  }
}
</script>

<style lang="scss">

  @import '~scss/main';

  .mobile-app-alert
  {
    .alert
    {
      border-color: darken(tomato, 10%);
      background-color: tomato;
      margin: 10px auto 5px;

      &, .alert-link {
        color: white;
      }

      .alert-link {
        text-decoration: underline;
      }
    }
  }

</style>
