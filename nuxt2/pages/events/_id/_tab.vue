<template>
  <div class="event">

    <component :is="components.header" :event="event" />
    <b-alert show v-if="!!event.has_training" variant="event-training">Режим учебных событий</b-alert>
    <component :is="components.tabs" :event="event" @onTabSwitch="onTabSwitch" v-if="event.id" />

    <b-row>

      <b-col cols="12" md="8">

        <div v-if="errorResponse" class="text-error">

          <div v-if="errorResponse.status === 403">
            <p>
              Доступ к информации по данному событию ограничен, пожалуйста, пройдите
              <NuxtLink :to="{name: 'sign-in'}">процедуру авторизации</NuxtLink>.
            </p>
            <p class="text-center">
              <a :href="feedbackUrl" target="_blank">Служба поддержки</a>
            </p>
          </div>

          <div v-else-if="errorResponse.status === 404">
            Данного события не существует.
            Пожалуйста, посмотрите, <NuxtLink to="/">последние землетрясения</NuxtLink>
            или выполните <NuxtLink to="/events">поиск в архиве</NuxtLink>.
          </div>

          <div v-else>
            <h4>Ошибка {{ errorResponse.status }}</h4>
            <p>{{ errorResponse.statusText }}</p>
            <p class="text-center">
              <a :href="feedbackUrl" target="_blank">Служба поддержки</a>
            </p>
          </div>

        </div>

        <keep-alive>
          <component
            :is="components.maps[components.currentTab]"
            :tab="components.currentTab"
            :event="event"
            v-if="event.id && !$onMobile" />
        </keep-alive>

        <keep-alive>
          <component :is="components.currentTab" :event="event" v-if="event.id" />
        </keep-alive>

      </b-col>

      <b-col cols="4">
        <keep-alive>
          <component :is="components.lastEvents" :event="event" v-if="!$onMobile && !!event.id" />
        </keep-alive>
      </b-col>

    </b-row>

  </div>

</template>

<script>
import Buildings from '@/components/Event/Buildings.vue'
import EventHeader from '@/components/Event/Header.vue'
import GeneralInformation from '@/components/Event/GeneralInformation.vue'
import LastEvents from '@/components/Event/LastEvents.vue'
import LDOs from '@/components/Event/LDOs.vue'
import MapBuildings from '@/components/Map/Buildings.vue'
import MapGeneralInformation from '@/components/Map/GeneralInformation.vue'
import MapLDOs from '@/components/Map/LDOs.vue'
import MapSettlements from '@/components/Map/Settlements.vue'
import MomentTensor from '@/components/Event/MomentTensor.vue'
import Settlements from '@/components/Event/Settlements.vue'
import Tabs from '@/components/Event/Tabs.vue'

import appSettings from '@/settings/app'
import apiSettings from '@/settings/api'

export default {
  components: {
    generalInformation: GeneralInformation,
    momentTensor: MomentTensor,
    settlements: Settlements,
    buildings: Buildings,
    ldos: LDOs
  },
  head() {
    return {
      title: ''
    }
  },
  data() {
    return {
      feedbackUrl: appSettings.feedbackUrl,
      mobileMapHidden: true,
      errorResponse: null,
      defaultViewport: '',
      components: {
        currentTab: this.$router.currentRoute.params.tab || (
          this.$onMobile ? 'settlements' : 'generalInformation'
        ),
        lastEvents: LastEvents,
        header: EventHeader,
        maps: {
          generalInformation: MapGeneralInformation,
          settlements: MapSettlements,
          buildings: MapBuildings,
          ldos: MapLDOs
        },
        tabs: Tabs
      },
      event: {
        processingMethod: {}
      }
    }
  },
  methods: {

    fetchData: function(eventId)
    {
      this.errorResponse = null

      let eventRequest = this.$axios.get(apiSettings.endpointEvent(eventId), {
        params: { include: 'nearestCity' }
      })

      if(!this.$store.getters['user/user'].authenticated)
      {
        eventRequest.then(response => {

          let event = response.data.data

          event.has_long_distance_objects_analysis = false
          event.has_buildings_msk64_analysis = false

          this.setData(event)

        }).catch(error => {
          this.errorResponse = error.response
        })
      }
      else
      {
        let buildingsRequest = this.$axios.get(apiSettings.endpointEventBuildings(eventId))

        let ldosRequest = this.$axios.get(apiSettings.endpointEventLDOs(eventId), {
          params: { customer_ids: [1], show_all_parts: 1 }
        })

        Promise.all([eventRequest, buildingsRequest, ldosRequest]).then(responses => {

          let [eventResp, buildingsResp, ldosResp] = responses

          let event = eventResp.data.data
          let buildings = buildingsResp.data.data
          let ldos = ldosResp.data.data

          buildings = buildings.filter(building => building.damage_level || building.building.data.destroyed)

          event.has_long_distance_objects_analysis = (event.has_long_distance_objects_analysis && ldos.length > 0)
          event.has_buildings_msk64_analysis = (event.has_buildings_msk64_analysis && buildings.length > 0)

          this.setData(event)

        })
      }

    },

    magnitudeType: function(type)
    {
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
      this.event.magnitude = data.locValues.data.mag.toFixed(1)
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
      this.components.currentTab = this.$onMobile ? 'settlements' : 'generalInformation'
    }

    next()
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/_variables';

.event-tab {
  margin-top: 5%;
}

.mobile-map-dialog
{
  position: fixed;
  top: 0; left: 0;

  &, > .mobile-map {
    height: 100%;
    width: 100vw;
  }

  .mobile-map {
    position: relative;
  }
}

</style>

