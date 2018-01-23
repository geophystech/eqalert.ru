<template>
  <div class="event">
    <component is="EventHeader" :event="event" />
    <component is="Tabs" @onTabSwitch="onTabSwitch"/>

    <b-row>
      <b-col cols="8">
        <keep-alive>
          <!-- <component is="generalInformation" :event="event" /> -->
        </keep-alive>
      </b-col>
      <b-col cols="4">
        <keep-alive>
          <component is="LastEvents" />
        </keep-alive>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import EventHeader from '@/components/event_components/Header'
import LastEvents from '@/components/event_components/LastEvents'
import Tabs from '@/components/event_components/Tabs'
// old is below
// import Buildings from '@/components/event_views/Buildings'
// import GeneralInformation from '@/components/event_views/GeneralInformation'
// import Ldos from '@/components/event_views/Ldos'
// import MomentTensor from '@/components/event_views/MomentTensor'
// import Settlements from '@/components/event_views/Settlements'

if (!window.map) window.map = {}

export default {
  components: {
    EventHeader,
    LastEvents,
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
    // this.$root.$on('changed::tab', tab => this.invalidateMapSize(tab.currentTab, this.$router.currentRoute.params.id))
    this.loadEvent(this.$router.currentRoute.params.id)
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.id) this.loadEvent(to.params.id)

    next()
  }
}
</script>
