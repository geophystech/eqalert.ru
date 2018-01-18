<template>
  <div class="event">
    <b-row class="event-header" no-gutters>
      <b-col cols="3"><b-breadcrumb :items="breadcrumbs" /></b-col>
      <b-col cols="8">
        <b-row>
          <b-col class="text-center">
            <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-show="spinners.header" />

            <h5 v-show="!spinners.header">
              <span class="magnitude-type" v-for="item in event.magnitudeType" :key="item[0]">
                <span>{{ item[0] }}</span><small>{{ item[1] }}</small>
              </span>
              ( <span class="magnitude">{{ event.magnitude }}</span> )
              {{ moment.utc(event.datetime).locale('ru').format('LL в HH:mm:ss UTC') }}
              <span class="processing-method">{{ event.processingMethod.short }}</span>
            </h5>
          </b-col>
        </b-row>

        <b-row v-show="!spinners.header">
          <b-col class="text-center">
            <b-badge
              :variant="event.label.variant"
              v-b-popover.hover.auto="event.label.description">
                {{ event.label.text }}
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
              <component is="generalInformation" :event="event" />
            </keep-alive>
          </b-col>
          <b-col cols="4">
            <keep-alive>
              <component is="lastEvents" :lastEvents="lastEvents" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Ближайшие населенные пункты"
        :href="tabsUrls.settlements"
        :active="currentPageUrl === tabsUrls.settlements"
        @click="switchView(tabsUrls.settlements)"
        v-if="event.has_cities_msk64_analysis">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="settlements" :event="event" />
            </keep-alive>
          </b-col>
          <b-col cols="4">
            <keep-alive>
              <component is="lastEvents" :lastEvents="lastEvents" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Здания и сооружения"
        :href="tabsUrls.buildings"
        :active="currentPageUrl === tabsUrls.buildings"
        @click="switchView(tabsUrls.buildings)"
        v-if="event.has_buildings_msk64_analysis">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="buildings" :event="event" />
            </keep-alive>
          </b-col>
          <b-col cols="4">
            <keep-alive>
              <component is="lastEvents" :lastEvents="lastEvents" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Тензор момента"
        :href="tabsUrls.momentTensor"
        :active="currentPageUrl === tabsUrls.momentTensor"
        @click="switchView(tabsUrls.momentTensor)"
        v-if="event.has_mt">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="momentTensor" />
            </keep-alive>
          </b-col>
          <b-col cols="4">
            <keep-alive>
              <component is="lastEvents" :lastEvents="lastEvents" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>

      <b-tab title="Магистральные объекты"
        :href="tabsUrls.ldos"
        :active="currentPageUrl === tabsUrls.ldos"
        @click="switchView(tabsUrls.ldos)"
        v-if="event.has_long_distance_objects_analysis">

        <b-row>
          <b-col cols="8">
            <keep-alive>
              <component is="ldos" :event="event" />
            </keep-alive>
          </b-col>
          <b-col cols="4">
            <keep-alive>
              <component is="lastEvents" :lastEvents="lastEvents" />
            </keep-alive>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

import Buildings from '@/components/event_views/Buildings'
import GeneralInformation from '@/components/event_views/GeneralInformation'
import LastEvents from '@/components/event_views/LastEvents'
import Ldos from '@/components/event_views/Ldos'
import MomentTensor from '@/components/event_views/MomentTensor'
import Settlements from '@/components/event_views/Settlements'
import Spinner from 'vue-simple-spinner'
import { round } from '@/helpers.js'

if (!window.map) window.map = {}

export default {
  components: {
    buildings: Buildings,
    generalInformation: GeneralInformation,
    lastEvents: LastEvents,
    ldos: Ldos,
    momentTensor: MomentTensor,
    settlements: Settlements,
    Spinner
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
        label: {},
        processingMethod: {}
      },
      lastEvents: [],
      momentTensor: {},
      spinners: {
        header: true
      },
      tabsUrls: {
        generalInformation: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid } }).href,
        settlements: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'settlements' } }).href,
        buildings: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'buildings' } }).href,
        momentTensor: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'moment-tensor' } }).href,
        ldos: this.$router.resolve({ name: 'Event', params: { hashid: this.$router.currentRoute.params.hashid, tab: 'ldos' } }).href
      }
    }
  },
  methods: {
    getEvent: function() {
      this.$http.get(this.$root.$options.settings.api.endpointEvent(this.$router.currentRoute.params.hashid))
        .then(response => {
          this.spinners.header = false
          this.event = response.data.data
          this.event.datetime = this.event.locValues.data.event_datetime
          this.event.hashid = this.$router.currentRoute.params.hashid // DELETE THIS LINE IF API STARTS RETURNING HASHID
          this.event.label = this.label(this.event.has_delete, this.event.has_final)
          this.event.magnitude = this.event.locValues.data.mag
          this.event.magnitudeType = this.magnitudeType(this.event.locValues.data.mag_t)
          this.event.processingMethod = this.processingMethod(this.event.has_auto, this.event.has_manual)
        })
        .catch(error => { console.log(error) })
    },
    getLastEvents: function() {
      this.$http.get(this.$root.$options.settings.api.endpointEvents, {
        params: {
          limit: 10,
          show_nearest_city: 1
        }
      })
        .then(response => {
          response.data.data.forEach(event => {
            event.hashid = event.id // REMOVE IT WHEN HASHID GET IMPLEMENTED IN API

            const distance = round(event.nearestCity.data.ep_dis, 2)
            const title = event.nearestCity.data.settlement.data.translation.data.title

            if (title) {
              event.settlement = `${distance} км до ${title}`
            } else {
              event.settlement = 'Населённый пункт: нет данных'
            }

            this.lastEvents.push(event)
          })
        })
        .catch(error => { console.log(error) })
    },
    invalidateMapSize: function(target) {
      const key = Object.keys(this.tabsUrls)[target]

      if (window.map[this.event.hashid][key]) {
        setTimeout(() => { window.map[this.event.hashid][key].invalidateSize() }, 1)
      }
    },
    label: function(deleted, final) {
      if (deleted) {
        return {
          description: 'Информация о землетрясении удалена из итогового каталога сейсмических событий',
          text: 'СОБЫТИЕ УДАЛЕНО',
          variant: 'deleted'
        }
      } else if (final) {
        return {
          description: 'Информация о землетрясении проверена и зарегистрирована в итоговом каталоге сейсмических событий',
          text: 'ФИНАЛЬНЫЙ РАСЧЁТ',
          variant: 'final'
        }
      } else {
        return {
          description: 'Информация о землетрясении уточняется',
          text: 'РАСЧЁТ ОБНОВЛЯЕТСЯ',
          variant: 'processing'
        }
      }
    },
    magnitudeType: function(type) {
      // Nested arrays are used because there may be multiple magnitude types.
      // But in most cases there will be only one type.
      switch (type) {
        case 'L': return [['M', 'L']]
        case 'b': return [['m', 'b']]
        case 'B': return [['m', 'B']]
        case 's': return [['M', 's']]
        case 'S': return [['M', 'S']]
        case 'W': return [['M', 'W']]
        case 'G': return [['M', 'b'], ['L', 'g']]
        case 'C': return [['M', 'c']]
        default: return [['M', '']]
      }
    },
    populateMap: function() {
      if (!window.map[this.event.hashid]) window.map[this.event.hashid] = {}
      Object.keys(this.tabsUrls).forEach(tab => { window.map[this.event.hashid][tab] = null })
    },
    processingMethod: function(auto, manual) {
      if (auto && !manual) return { long: 'автоматический', short: 'A' }
      if (auto && manual) return { long: 'смешанный', short: 'AM' }
      if (!auto && manual) return { long: 'ручной', short: 'M' }

      return { long: 'неизвестно', short: 'U' }
    },
    switchView: function(href) {
      history.pushState({}, null, href)
    }
  },
  computed: {
    moment: function() {
      return moment
    }
  },
  created() {
    this.getLastEvents()

    this.$root.$on('changed::tab', tab => this.invalidateMapSize(tab.currentTab))

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

    .badge-deleted {
      background-color: $color-red;
      color: $color-white;
    }

    .badge-final {
      background-color: $color-green;
      color: $color-white;
    }

    .badge-processing {
      background-color: $color-orange;
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
        }
      }
    }

    .tab-content {
      padding-top: 2%;
    }
  }
</style>
