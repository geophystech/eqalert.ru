<template>
  <div class="event">
    <component is="EventHeader" :event="event" />

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
              <component is="momentTensor" :event="event" />
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
import EventHeader from '@/components/event_components/Header'
// old is below
import Buildings from '@/components/event_views/Buildings'
import GeneralInformation from '@/components/event_views/GeneralInformation'
import LastEvents from '@/components/event_views/LastEvents'
import Ldos from '@/components/event_views/Ldos'
import MomentTensor from '@/components/event_views/MomentTensor'
import Settlements from '@/components/event_views/Settlements'
import { round } from '@/helpers.js'

if (!window.map) window.map = {}

export default {
  components: {
    EventHeader,
    buildings: Buildings,
    generalInformation: GeneralInformation,
    lastEvents: LastEvents,
    ldos: Ldos,
    momentTensor: MomentTensor,
    settlements: Settlements
  },
  name: 'event',
  data() {
    return {
      currentPageUrl: `#${this.$router.currentRoute.fullPath}`,
      event: {
        label: {},
        processingMethod: {}
      },
      lastEvents: [],
      momentTensor: {},
      tabsUrls: {
        generalInformation: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id } }).href,
        settlements: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'settlements' } }).href,
        buildings: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'buildings' } }).href,
        momentTensor: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'moment-tensor' } }).href,
        ldos: this.$router.resolve({ name: 'Event', params: { id: this.$router.currentRoute.params.id, tab: 'ldos' } }).href
      }
    }
  },
  methods: {
    getEvent: function(id) {
      this.$http.get(this.$root.$options.settings.api.endpointEvent(id))
        .then(response => {
          this.event = response.data.data
          this.event.datetime = this.event.locValues.data.event_datetime
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
    invalidateMapSize: function(target, id) {
      const key = Object.keys(this.tabsUrls)[target]

      if (window.map[id][key]) setTimeout(() => { window.map[id][key].invalidateSize() }, 1)
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
    loadEvent: function(id) {
      this.getEvent(id)
      this.populateMap(id)
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
    populateMap: function(id) {
      if (!window.map[id]) window.map[id] = {}
      Object.keys(this.tabsUrls).forEach(tab => { window.map[id][tab] = null })
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
  created() {
    this.getLastEvents()
    this.$root.$on('changed::tab', tab => this.invalidateMapSize(tab.currentTab, this.$router.currentRoute.params.id))
    this.loadEvent(this.$router.currentRoute.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id) this.loadEvent(to.params.id)

    next()
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/global.scss';

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
