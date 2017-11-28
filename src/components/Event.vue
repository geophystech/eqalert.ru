<template>
  <div class="event">
    <b-row class="event-header" no-gutters>
      <b-col cols="3"><b-breadcrumb :items="breadcrumbs" /></b-col>
      <b-col cols="8">
        <b-row>
          <b-col class="text-center">
            <h5>
              <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
                <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
              </span>
              ( <span class="magnitude">{{ event.magnitude }}</span> )
              {{ event.datetime }}
              <span class="processing-method">{{ event.processingMethod }}</span>
            </h5>
          </b-col>
        </b-row>

        <b-row>
          <b-col class="text-center">
            <b-badge
              variant="final"
              v-b-popover.hover.auto="'Информация о землетрясении проверена и зарегистрирована в итоговом каталоге сейсмических событий'">
                ФИНАЛЬНЫЙ РАСЧЁТ
            </b-badge>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="1" class="text-right">
        <b-button-group>
          <b-dropdown right text="Скачать" size="sm" variant="secondary">
            <b-dropdown-item>Скачать в формате XLS</b-dropdown-item>
          </b-dropdown>
        </b-button-group>
      </b-col>
    </b-row>

    <b-tabs>
      <b-tab title="Общая информация"
        :href="tabsUrls.generalInformation"
        :active="currentPageUrl === tabsUrls.generalInformation"
        @click="switchView(tabsUrls.generalInformation)">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="generalInformation" hashid="hashid" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Ближайшие населенные пункты"
        :href="tabsUrls.settlements"
        :active="currentPageUrl === tabsUrls.settlements"
        @click="switchView(tabsUrls.settlements)">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="settlements" hashid="hashid" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Здания и сооружения"
        :href="tabsUrls.buildings"
        :active="currentPageUrl === tabsUrls.buildings"
        @click="switchView(tabsUrls.buildings)">

        <keep-alive>
          <component is="buildings" />
        </keep-alive>
      </b-tab>

      <b-tab title="Тензор момента"
        :href="tabsUrls.momentTensor"
        :active="currentPageUrl === tabsUrls.momentTensor"
        @click="switchView(tabsUrls.momentTensor)">

        <keep-alive>
          <component is="momentTensor" />
        </keep-alive>
      </b-tab>

      <b-tab title="Магистральные объекты"
        :href="tabsUrls.ldos"
        :active="currentPageUrl === tabsUrls.ldos"
        @click="switchView(tabsUrls.ldos)">

        <keep-alive>
          <component is="ldos" />
        </keep-alive>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

import Buildings from '@/components/event_views/Buildings'
import GeneralInformation from '@/components/event_views/GeneralInformation'
import Ldos from '@/components/event_views/Ldos'
import MomentTensor from '@/components/event_views/MomentTensor'
import Settlements from '@/components/event_views/Settlements'

if (!window.map) window.map = {}

export default {
  components: {
    buildings: Buildings,
    generalInformation: GeneralInformation,
    ldos: Ldos,
    momentTensor: MomentTensor,
    settlements: Settlements
  },
  name: 'event',
  data() {
    return {
      currentPageUrl: `#${this.$router.currentRoute.fullPath}`,
      breadcrumbs: [
        {
          text: 'Главная',
          href: this.$router.resolve({ name: 'Mainpage' }).href
        }, {
          text: 'События',
          href: this.$router.resolve({ name: 'Events' }).href
        }, {
          text: this.$router.currentRoute.params.hashid,
          active: true
        }],
      event: {
        datetime: '',
        hashid: '',
        magnitude: '4.5',
        magnitudeType: [['M', 'L']],
        processingMethod: 'M'
      },
      tabsUrls: {
        generalInformation: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid } }).href,
        settlements: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'settlements' } }).href,
        buildings: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'buildings' } }).href,
        ldos: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'ldos' } }).href,
        momentTensor: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'moment-tensor' } }).href
      }
    }
  },
  methods: {
    convertMagnitudeType: function(type) {
      switch (type) {
        case 'L':
          this.event.magnitudeType.push(['M', 'L'])
          break
        case 'b':
          this.event.magnitudeType.push(['m', 'b'])
          break
        case 'B':
          this.event.magnitudeType.push(['m', 'B'])
          break
        case 's':
          this.event.magnitudeType.push(['M', 's'])
          break
        case 'S':
          this.event.magnitudeType.push(['M', 'S'])
          break
        case 'W':
          this.event.magnitudeType.push(['M', 'W'])
          break
        case 'G':
          this.event.magnitudeType.push(['M', 'b'])
          this.event.magnitudeType.push(['L', 'g'])
          break
        case 'C':
          this.event.magnitudeType.push(['M', 'c'])
          break
        default:
          this.event.magnitudeType.push(['M', ''])
      }
    },
    getEvent: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/b090c866778c02ddd63c5dc1667317f9/raw/a41ec3cd01d380d553cf1655a16d10a56d5c7979/eq_KEXKBvM0_general_information.json')
        .then(response => {
          this.event.datetime = moment.utc(response.data.event.datetime).locale('ru').format('LL в HH:mm:ss UTC')
        })
        .catch(error => { console.log(error) })
    },
    invalidateMapSize: function(target) {
      const key = Object.keys(this.tabsUrls)[target]

      if (window.map[this.event.hashid][key]) {
        setTimeout(() => { window.map[this.event.hashid][key].invalidateSize() }, 1)
      }
    },
    populateMap: function() {
      if (!window.map[this.event.hashid]) window.map[this.event.hashid] = {}
      Object.keys(this.tabsUrls).forEach(tab => { window.map[this.event.hashid][tab] = null })
    },
    switchView: function(href) {
      history.pushState({}, null, href)
    }
  },
  created() {
    this.$root.$on('changed::tab', tab => {
      this.invalidateMapSize(tab.currentTab)
    })

    this.event.hashid = this.$router.currentRoute.params.hashid
    this.getEvent()
    this.populateMap()
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/global.scss';

  .event-header {
    margin-bottom: 3%;
    margin-top: 4%;

    .breadcrumb {
      background-color: transparent;
      padding-left: 0;
      padding-top: 0;

      .active {
        color: #444;
      }
    }

    .badge {
      font-size: 70%;
      padding: 1%;
      text-transform: uppercase;
    }

    .badge-final {
      background-color: $color-green;
      color: $color-white;
    }
    .magnitude {
      color: $color-orange;
    }

    .processing-method {
      color: $color-blue;
    }
  }

  .tabs {
    .nav-tabs {
      justify-content: center;

      .nav-item{
        a {
          font-size: 90%;
          font-weight: bold;
        }
      }
    }

    .tab-content {
      padding-top: 2%;
    }
  }
</style>
