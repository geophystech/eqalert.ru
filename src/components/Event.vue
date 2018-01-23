<template>
  <div class="event">
    <component is="EventHeader" :event="event" />
    <component is="Tabs" @onTabSwitch="onTabSwitch"/>

    <!-- <b-tabs>
      <b-tab title="Общая информация"
        :href="tabs.generalInformation"
        :active="currentPageUrl === tabs.generalInformation"
        @click="switchView(tabs.generalInformation)">

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
        :href="tabs.settlements"
        :active="currentPageUrl === tabs.settlements"
        @click="switchView(tabs.settlements)"
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
        :href="tabs.buildings"
        :active="currentPageUrl === tabs.buildings"
        @click="switchView(tabs.buildings)"
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
        :href="tabs.momentTensor"
        :active="currentPageUrl === tabs.momentTensor"
        @click="switchView(tabs.momentTensor)"
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
        :href="tabs.ldos"
        :active="currentPageUrl === tabs.ldos"
        @click="switchView(tabs.ldos)"
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
    </b-tabs> -->
  </div>
</template>

<script>
import EventHeader from '@/components/event_components/Header'
import Tabs from '@/components/event_components/Tabs'
// old is below
// import Buildings from '@/components/event_views/Buildings'
// import GeneralInformation from '@/components/event_views/GeneralInformation'
// import LastEvents from '@/components/event_views/LastEvents'
// import Ldos from '@/components/event_views/Ldos'
// import MomentTensor from '@/components/event_views/MomentTensor'
// import Settlements from '@/components/event_views/Settlements'
import { round } from '@/helpers.js'

if (!window.map) window.map = {}

export default {
  components: {
    EventHeader,
    Tabs
    // buildings: Buildings,
    // generalInformation: GeneralInformation,
    // lastEvents: LastEvents,
    // ldos: Ldos,
    // momentTensor: MomentTensor,
    // settlements: Settlements
  },
  name: 'event',
  data() {
    return {
      event: {
        label: {},
        processingMethod: {}
      },
      lastEvents: [],
      momentTensor: {}
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
      const key = Object.keys(this.tabs)[target]

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
      // this.populateMap(id)
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
    onTabSwitch: function(value) {
      console.log(value)
    },
    populateMap: function(id) {
      if (!window.map[id]) window.map[id] = {}
      Object.keys(this.tabs).forEach(tab => { window.map[id][tab] = null })
    },
    processingMethod: function(auto, manual) {
      if (auto && !manual) return { long: 'автоматический', short: 'A' }
      if (auto && manual) return { long: 'смешанный', short: 'AM' }
      if (!auto && manual) return { long: 'ручной', short: 'M' }

      return { long: 'неизвестно', short: 'U' }
    }
  },
  created() {
    this.getLastEvents()
    // this.$root.$on('changed::tab', tab => this.invalidateMapSize(tab.currentTab, this.$router.currentRoute.params.id))
    this.loadEvent(this.$router.currentRoute.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id) this.loadEvent(to.params.id)

    next()
  }
}
</script>
