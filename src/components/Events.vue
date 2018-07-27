<template>
  <div class="events">
    <CountersHeader
      :count="events.length"
      :startDate="startDate"
      :endDate="endDate" />

    <b-row no-gutters>
      <Filters :disabled="disabledFilters" @filtersUpdated="getEvents" key="mainpage-filters" v-if="!$root.onMobile" />

      <b-col class="all-events">
        <Spinner line-fg-color="#337ab7" :line-size="1" v-if="spinners.loadMoreEvents && !events.length" />

        <b-row no-gutters class="events-head text-center">
          <b-col v-if="!$root.onMobile" md="1">#</b-col>
          <b-col cols="3" md="1">Магнитуда</b-col>
          <b-col cols="3" md="2">Глубина</b-col>
          <b-col cols="6" md="4" class="datetime">Дата и время</b-col>
          <b-col cols="12" md="4" v-if="!$root.onMobile">Ближайший населённый пункт</b-col>
        </b-row>

        <router-link v-for="(event, index) in events" :key="event.id" :to="{ name: 'Event', params: { id: event.id } }">
          <b-row no-gutters class="events-row text-center">
            <b-col v-if="!$root.onMobile" md="1">{{ index + 1 }}</b-col>
            <b-col cols="3" md="1">
              <span :class="{ 'highlight-event': event.locValues.data.mag > highlightEventTreshold }">
                {{ event.locValues.data.mag.toFixed(1) }}
              </span>
            </b-col>
            <b-col cols="3" md="2">{{ event.locValues.data.depth }} км</b-col>
            <b-col cols="6" md="4" class="datetime">{{ event.locValues.data.event_datetime | moment(datetimeFormat) }}</b-col>
            <b-col cols="12" md="4" class="settlement" v-if="!$root.onMobile">
              <span v-if="!event.nearestCity">Нет данных</span>
              <span v-else>
                {{ round(event.nearestCity.data.ep_dis, 1) }} км до {{ event.nearestCity.data.settlement.data.translation.data.title }}
              </span>
            </b-col>
          </b-row>
        </router-link>

        <b-row class="load-more-events" no-gutters>
          <b-col class="text-center">
            <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-if="spinners.loadMoreEvents" />
            <a href="javascript:void(0)" @click.prevent="loadMoreEvents" v-if="apiParams.cursor && !spinners.loadMoreEvents">Показать больше событий</a>
            <span v-if="!apiParams.cursor">Загружены все события</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CountersHeader from '@/components/CountersHeader.vue'
import Filters from '@/components/Filters.vue'
import Spinner from 'vue-simple-spinner'
import { round } from '@/helpers/math.js'

export default {
  components: { CountersHeader, Filters, Spinner },
  data() {
    return {
      apiParams: {
        cursor: '',
        limit: 10,
        include: 'nearestCity'
      },
      events: [],
      disabledFilters: false,
      highlightEventTreshold: this.$root.$options.settings.events.highlightTreshold,
      spinners: {
        loadMoreEvents: false
      },
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    round: function() {
      return round
    },
    datetimeFormat: function() {
      if (this.$root.onMobile) {
        return 'L в HH:mm:ss'
      } else {
        return 'LL в HH:mm:ss UTC'
      }
    }
  },
  metaInfo: {
    title: 'События'
  },
  methods: {
    getEvents: function(data) {
      let params = this.apiParams

      // Use cursor only on loadMoreEvents()
      if (typeof data === 'object') {
        params.cursor = null
        Object.assign(params, data)
      }

      this.spinners.loadMoreEvents = true
      this.disabledFilters = true

      this.$http.get(this.$root.$options.settings.api.endpointEvents, { params: params })
        .then(response => {
          this.spinners.loadMoreEvents = false

          if (typeof data === 'object') {
            this.events = response.data.data
          } else {
            this.events = this.events.concat(response.data.data)
          }

          this.apiParams.cursor = response.data.meta.cursor.next

          if (!response.data.data.length) return

          this.startDate = this.$moment().utc(this.events[this.events.length - 1].locValues.data.event_datetime).format('L')
          this.endDate = this.$moment().utc(this.events[0].locValues.data.event_datetime).format('L')
        })
        .catch(error => {
          console.log(error)
        })

      this.disabledFilters = false
    },
    loadMoreEvents: function() {
      this.getEvents()
    },
    openEvent: function(item, index, event) {
      this.$router.push({ name: 'Event', params: { id: item.id } })
    }
  },
  created() {
    this.getEvents()
  }
}
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  .events {
    .all-events {
      font-size: 90%;

      a {
        color: $color-gray-dark;
        text-decoration: none;
      }

      .datetime {
        @media screen and (max-width: 767px) {
          font-size: 90%;
          margin-top: 1%;
        }
      }

      .events-head {
        border: 1px solid $color-gray-light-4;
        border-radius: $border-radius;
        font-weight: bold;
        padding: 0.75rem;

        @media screen and (max-width: 767px) {
          font-size: 70%;
        }

        .datetime {
          @media screen and (max-width: 767px) {
            font-size: 100%;
            margin-top: 0;
          }
        }
      }

      .events-row {
        border: 1px solid $color-gray-light-4;
        border-radius: $border-radius;
        border-top: none;
        padding: 0.75rem;

        &:hover {
          background-color: rgba(0, 0, 0, 0.075);
          cursor: pointer;
        }

        .datetime {
          @media screen and (max-width: 767px) {
            font-size: 90%;
            margin-top: 1%;
          }
        }
      }

      .load-more-events {
        border: 1px solid $color-gray-light-4;
        border-radius: $border-radius;
        border-top: none;
        padding: 0.75rem;

        a {
          border-bottom: 1px dotted $color-blue;
          color: $color-blue;
          font-weight: bold;
          text-decoration: none;
        }
      }
    }

    .highlight-event {
      color: $color-orange;
      font-weight: bold;
    }
  }
</style>
