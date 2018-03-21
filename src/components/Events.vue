<template>
  <div class="events">
    <CountersHeader
      :count="events.length"
      :startDate="startDate"
      :endDate="endDate" />

    <b-row no-gutters>
      <Filters />
      <b-col class="all-events">
        <Spinner line-fg-color="#337ab7" :line-size="1" v-if="spinners.loadMoreEvents && !events.length" />

        <b-table
          hover
          :fields="fields"
          :items="events"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @row-clicked="openEvent"
          v-if="events.length" >
          <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
          <template slot="magnitude" slot-scope="data">
            <span :class="{ 'highlight-event': data.item.locValues.data.mag > highlightEventTreshold }">
              {{ data.item.locValues.data.mag }}
            </span>
          </template>
          <template slot="depth" slot-scope="data">{{ data.item.locValues.data.depth }} км</template>
          <template slot="datetime" slot-scope="data">
            {{ moment.utc(data.item.locValues.data.event_datetime).locale('ru').format('LL в HH:mm:ss UTC') }}
          </template>
          <template slot="settlement" slot-scope="data">
            <span v-if="!data.item.nearestCity">Нет данных</span>
            <span v-else>
              {{ round(data.item.nearestCity.data.ep_dis, 1) }} км до {{ data.item.nearestCity.data.settlement.data.translation.data.title }}
            </span>
          </template>
          <template slot="bottom-row" slot-scope="data">
            <td :colspan="data.columns">
              <Spinner line-fg-color="#337ab7" :line-size="1" size="26" v-if="spinners.loadMoreEvents" />
              <a href="javascript:void(0)" @click.prevent="getEvents" v-if="cursor && !spinners.loadMoreEvents">Показать больше событий</a>
              <span v-else>Загружены все события</span>
            </td>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

import CountersHeader from '@/components/CountersHeader.vue'
import Filters from '@/components/Filters.vue'
import Spinner from 'vue-simple-spinner'
import { round } from '@/helpers/math.js'

export default {
  components: { CountersHeader, Filters, Spinner },
  data() {
    return {
      cursor: '',
      events: [],
      fields: [
        { key: 'index', label: '#' },
        { key: 'magnitude', label: 'Магнитуда', sortable: true },
        { key: 'depth', label: 'Глубина', sortable: true },
        { key: 'datetime', label: 'Дата и время', sortable: true },
        { key: 'settlement', label: 'Ближайший населённый пункт', sortable: true }
      ],
      highlightEventTreshold: this.$root.$options.settings.events.highlightTreshold,
      sortBy: 'datetime',
      sortDesc: true,
      spinners: {
        loadMoreEvents: false
      },
      startDate: '',
      endDate: ''
    }
  },
  computed: {
    moment: function() {
      return moment
    },
    round: function() {
      return round
    }
  },
  metaInfo: {
    title: 'События'
  },
  methods: {
    getEvents: function() {
      this.spinners.loadMoreEvents = true

      this.$http.get(this.$root.$options.settings.api.endpointEvents, {
        params: {
          cursor: this.cursor,
          limit: 10,
          show_nearest_city: 1
        }
      })
        .then(response => {
          this.spinners.loadMoreEvents = false
          this.events = this.events.concat(response.data.data)
          this.cursor = response.data.meta.cursor.next

          this.startDate = moment.utc(this.events[this.events.length - 1].locValues.data.event_datetime).locale('ru').format('L')
          this.endDate = moment.utc(this.events[0].locValues.data.event_datetime).locale('ru').format('L')
        })
        .catch(error => { console.log(error) })
    },
    openEvent: function(item) {
      this.$router.push({ name: 'Event', params: { id: item.id } })
    }
  },
  created() {
    this.getEvents()
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/global.scss';

  .events {
    .all-events {
      font-size: 90%;

      table {
        border: 1px solid $color-gray-light-4;
        border-radius: $border-radius;
        text-align: center;

        thead {
          background-color: $color-white-2;

          tr {
            th {
              text-align: center;
            }
          }
        }

        tbody {
          tr {
            &:last-child {
              a {
                border-bottom: 1px dotted $color-blue;
                font-weight: bold;
                text-decoration: none;
              }
            }

            &:hover:not(:last-child) {
              cursor: pointer;
            }
          }
        }
      }
    }

    .highlight-event {
      color: $color-orange;
      font-weight: bold;
    }
  }
</style>
