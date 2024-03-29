<template>
  <div class="events">
    <BasicCountersHeader v-if="!error"
                    :trainingEventsBtnShow="$store.getters['user/user'].authenticated"
                    :trainingEventsBtnDisabled="spinners.loadMoreEvents"
                    @toggleTrainingEvents="toggleTrainingEvents"
                    :filtersData="filtersData"
                    :showModalMap="true"
                    :count="events.length"
                    :startDate="startDate"
                    :endDate="endDate" />

    <b-row style="margin-top: 33px" no-gutters>

      <ClientOnly>
        <AnalyticsFilters
          :disabled="disabledFilters"
          @filtersUpdated="getEvents"
          key="mainpage-filters"
          v-if="!onMobile"
          ref="filters"
        />
      </ClientOnly>

      <b-col v-if="error">
        <b-alert show variant="danger">{{ error }}</b-alert>
      </b-col>

      <b-col v-if="!error" class="all-events">

        <ClientOnly>
          <Spinner :size="32" v-if="spinners.loadMoreEvents" />
        </ClientOnly>

        <b-row no-gutters class="events-head text-center">
          <ClientOnly>
            <b-col v-if="!onMobile" md="1">#</b-col>
          </ClientOnly>
          <b-col cols="3" md="1">Магнитуда</b-col>
          <b-col cols="3" md="2">Глубина</b-col>
          <b-col cols="6" md="4" class="datetime">Дата и время</b-col>
          <ClientOnly>
            <b-col cols="12" md="4" v-if="!onMobile">Ближайший населённый пункт</b-col>
          </ClientOnly>
        </b-row>

        <NuxtLink v-for="(event, index) in events" :key="event.id"
                     :to="{ name: 'events-id-tab', params: { id: event.id }, query: {backUrlQuery: backUrlQuery} }">

          <b-row no-gutters class="events-row text-center">

            <ClientOnly>
              <b-col v-if="!onMobile" md="1">{{ index + 1 }}</b-col>
            </ClientOnly>

            <b-col cols="3" md="1">
              <span :class="{ 'highlight-event': event.locValues.data.mag > highlightEventTreshold }">
                {{ event.locValues.data.mag.toFixed(1) }}
              </span>
            </b-col>

            <b-col cols="3" md="2">{{ event.locValues.data.depth }} км</b-col>

            <b-col cols="6" md="4" class="datetime">
              {{ $moment(event.locValues.data.event_datetime).format(datetimeFormat) }}
            </b-col>

            <ClientOnly>
              <b-col cols="12" md="4" class="settlement" v-if="!onMobile">
                <span v-if="!event.nearestCity">Нет данных</span>
                <span v-else>
                  {{ round(event.nearestCity.data.ep_dis, 1) }} км
                  до {{ event.nearestCity.data.settlement.data.translation.data.title }}
                </span>
              </b-col>
            </ClientOnly>

          </b-row>

        </NuxtLink>

        <b-row class="load-more-events" no-gutters>
          <b-col class="text-center">
            <ClientOnly>
              <Spinner v-if="spinners.loadMoreEvents" />
            </ClientOnly>
            <a href="#" v-if="apiParams.cursor && !spinners.loadMoreEvents" id="loadMoreEventsBtn"
               @click.prevent="loadMoreEvents">Показать больше событий</a>
            <span v-if="!apiParams.cursor">Загружены все события</span>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { round } from '@/helpers/math'
import eventsSettings from '@/settings/events'
import mixins from '@/mixins/events'
import onMobile from "@/mixins/onMobile";

export default {
  props: {
  },
  components: {
    Spinner: () => (process.client) ? import('@/components/Basic/Spinner.vue') : null,
  },
  mixins: [mixins, onMobile],
  data() {
    return {
      error: '',
      filtersData: {},
      apiParams: {
        include: 'nearestCity',
        cursor: '',
        limit: 10
      },
      disabledFilters: false,
      highlightEventTreshold: eventsSettings.highlightTreshold,
      spinners: {
        loadMoreEvroundents: false
      },
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    round: function() {
      return round
    },
    datetimeFormat: function()
    {
      if (this.onMobile) {
        return 'L в HH:mm:ss'
      }

      return 'LL в HH:mm:ss UTC'
    },
    backUrlQuery: function()
    {
      return JSON.stringify(this.$route.query)
    }
  },
  head: {
    title: 'События',
    description: 'Последние землетрясения, интенсивность в ближайших населённых пунктах'
  },
  watch: {
    error: function(msg) {
      if (msg) window.scrollTo(0, 0)
    }
  },
  methods: {
    getEvents: function(filtersData)
    {
      this.error = ''

      let _getEvents = () => {

        let params = this.apiParams

        // Use cursor only on loadMoreEvents()
        if (typeof filtersData === 'object') {
          params.cursor = null
          Object.assign(params, filtersData)
          this.filtersData = Object.assign({}, filtersData)
        }

        // edge case >> fix
        if (!params.datetime_min) {
          params.datetime_min = this.$moment
            .utc()
            .subtract(3, 'months')
            .format('YYYY-MM-DD 00:00:00')
          this.$router.replace({
            name: this.$route.name,
            query: { datetime_min: params.datetime_min }
          })
        }

        this.spinners.loadMoreEvents = true
        this.disabledFilters = true

        this.$axios.get(this.$api.endpointEvents, { params: params })
          .then(response => {

            this.spinners.loadMoreEvents = false
            this.disabledFilters = false

            if (typeof filtersData === 'object') {
              this.events = response.data.data
            } else {
              this.events = this.events.concat(response.data.data)
            }

            this.apiParams.cursor = response.data.meta.cursor.next

            if (!response.data.data.length) return

            this.startDate = this.$moment(this.events[this.events.length - 1].locValues.data.event_datetime).format('L')
            this.endDate = this.$moment(this.events[0].locValues.data.event_datetime).format('L')
          })
          .catch(error => {

            let resp = error.response
            let data = resp.data

            switch(resp.status)
            {
              case(422):
                this.$refs.filters.setErrors(data.errors.data)
                break

              case(400):
                this.error = data.error.message
                break

              default:

                try {
                  this.error = data.error.message
                } catch(e) {
                  this.error = error
                }

                break
            }

            this.spinners.loadMoreEvents = false
            this.disabledFilters = false
            this.events = []
          })

      }

      if (this._getEventsTimeout) clearTimeout(this._getEventsTimeout)
      this._getEventsTimeout = setTimeout(_getEvents, 50)
    },
    loadMoreEvents: function() {
      this.getEvents()
    },
    toggleTrainingEvents: function(checked) {
      this.$refs.filters.filters.has_training = checked ? 1 : null
      this.$refs.filters.send()
    }
  }
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/_variables';

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
