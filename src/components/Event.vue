<template>
  <div class="event">
    <component :is="components.header" :event="event" />
    <component :is="components.tabs" :event="event" @onTabSwitch="onTabSwitch" v-if="event.id"/>

    <b-row>
      <b-col cols="8">
        <keep-alive>
          <component :is="components.maps[components.currentTab]" :tab="components.currentTab" :event="event" v-if="event.id" />
        </keep-alive>

        <keep-alive>
          <component :is="components.currentTab" :event="event" v-if="event.id" />
        </keep-alive>
      </b-col>
      <b-col cols="4">
        <keep-alive>
          <component :is="components.lastEvents" :event="event"/>
        </keep-alive>
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import Buildings from '@/components/event/Buildings'
  import EventHeader from '@/components/event/Header'
  import GeneralInformation from '@/components/event/GeneralInformation'
  import LastEvents from '@/components/event/LastEvents'
  import LDOs from '@/components/event/LDOs'
  import MapBuildings from '@/components/maps/Buildings'
  import MapGeneralInformation from '@/components/maps/GeneralInformation'
  import MapLDOs from '@/components/maps/LDOs'
  import MapSettlements from '@/components/maps/Settlements'
  import MomentTensor from '@/components/event/MomentTensor'
  import Settlements from '@/components/event/Settlements'
  import Tabs from '@/components/event/Tabs'

  export default {
    components: {
      buildings: Buildings,
      generalInformation: GeneralInformation,
      ldos: LDOs,
      momentTensor: MomentTensor,
      settlements: Settlements
    },
    data() {
      return {
        components: {
          currentTab: this.$router.currentRoute.params.tab || 'generalInformation',
          header: EventHeader,
          lastEvents: LastEvents,
          maps: {
            buildings: MapBuildings,
            generalInformation: MapGeneralInformation,
            ldos: MapLDOs,
            settlements: MapSettlements
          },
          tabs: Tabs
        },
        event: {
          processingMethod: {}
        }
      }
    },
    methods: {
      fetchData: function(id) {
        this.$http.get(this.$root.$options.settings.api.endpointEvent(id), {
          params: {
            include: 'nearestCity'
          }
        })
          .then(response => {
            this.setData(response.data.data)
          })
          .catch(error => {
            console.log(error)
          })
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
          case 'mww': return [['M', 'mww']]
          default: return [['M', '']]
        }
      },
      onTabSwitch: function(tab) {
        this.components.currentTab = tab
      },
      processingMethod: function(auto, manual) {
        if (auto && !manual) return { long: 'автоматический', short: 'A' }
        if (auto && manual) return { long: 'смешанный', short: 'AM' }
        if (!auto && manual) return { long: 'ручной', short: 'M' }

        return { long: 'неизвестно', short: 'U' }
      },
      setData: function(data) {
        this.event = data
        this.event.datetime = data.locValues.data.event_datetime
        this.event.magnitude = data.locValues.data.mag
        this.event.magnitudeType = this.magnitudeType(data.locValues.data.mag_t)
        this.event.processingMethod = this.processingMethod(data.has_auto, data.has_manual)
      }
    },
    created() {
      this.fetchData(this.$router.currentRoute.params.id)
    },
    beforeRouteUpdate(to, from, next) {
      // Fetch data only when event id is changed.
      // Do nothing on switching tabs.
      if (to.params.id !== this.$router.currentRoute.params.id) {
        this.fetchData(to.params.id)
        this.components.currentTab = 'generalInformation'
      }

      next()
    }
  }
</script>

<style lang="scss" scoped>
  .event-tab {
    margin-top: 5%;
  }
</style>

