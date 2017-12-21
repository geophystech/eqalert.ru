<template>
  <div class="events">
    <b-row class="infobar" align-v="center" no-gutters>
      <b-col>
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <router-link to="/">Снять ограничения данных</router-link>
      </b-col>
      <b-col cols="8">
        Загружено <span class="events-count">{{ events.length }}</span> событий
        <span v-if="events.length">
          ({{ moment.utc(events[events.length - 1].locValues.data.event_datetime).locale('ru').format('L') }}
          —
          {{ moment.utc(events[0].locValues.data.event_datetime).locale('ru').format('L') }})
        </span>
      </b-col>
    </b-row>

    <b-row no-gutters>
      <b-col class="filters" cols="3">
        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">Магнитуда</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col cols="5">
                <b-input-group left="От">
                  <b-form-input v-model.trim="filters.magMin" placeholder="2.5" />
                </b-input-group>
              </b-col>
              <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
              <b-col cols="5">
                <b-input-group left="До">
                  <b-form-input v-model.trim="filters.magMax" placeholder="10.0" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">Широта</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col cols="5">
                <b-input-group left="От">
                  <b-form-input v-model.trim="filters.latMin" placeholder="51.1" />
                </b-input-group>
              </b-col>
              <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
              <b-col cols="5">
                <b-input-group left="До">
                  <b-form-input v-model.trim="filters.latMax" placeholder="70.1" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">Долгота</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col cols="5">
                <b-input-group left="От">
                  <b-form-input v-model.trim="filters.lonMin" placeholder="145.1" />
                </b-input-group>
              </b-col>
              <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
              <b-col cols="5">
                <b-input-group left="До">
                  <b-form-input v-model.trim="filters.lonMax" placeholder="190.1" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">Количество станций</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col>
                <b-input-group left="Минимум">
                  <b-form-input v-model.trim="filters.staNumMin" placeholder="145.1" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">Глубина</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col cols="5">
                <b-input-group left="От">
                  <b-form-input v-model.trim="filters.depthMin" placeholder="0" />
                </b-input-group>
              </b-col>
              <b-col class="text-center middle-col"><i class="fa fa-arrows-h" aria-hidden="true"></i></b-col>
              <b-col cols="5">
                <b-input-group left="До">
                  <b-form-input v-model.trim="filters.depthMax" placeholder="10" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col align-self="center">
            <b-row no-gutters><b-col class="text-center filter-title">RMS</b-col></b-row>
            <b-row no-gutters class="filter-inputs" align-v="center">
              <b-col>
                <b-input-group left="Максимум">
                  <b-form-input v-model.trim="filters.rmsMax" placeholder="145.1" />
                </b-input-group>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col>
            <b-row no-gutters class="filter-inputs">
              <b-col>
                <b-form-checkbox v-model="filters.hasMt">
                  Только с тензором момента
                </b-form-checkbox>
              </b-col>
            </b-row>
          </b-col>
        </b-row>

        <b-row class="filter" no-gutters>
          <b-col class="text-center">
            <b-button size="sm">Сбросить фильтры</b-button>
          </b-col>
        </b-row>
      </b-col>
      <b-col class="all-events">
        <b-table
          hover
          :fields="fields"
          :items="events"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @row-clicked="openEvent">
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
            <span v-if="data.item.nearestCity.data.settlement.data.translation.data.title === null">Нет данных</span>
            <span v-else>
              {{ round(data.item.nearestCity.data.ep_dis, 1) }} км до {{ data.item.nearestCity.data.settlement.data.translation.data.title }}
            </span>
          </template>
          <template slot="bottom-row" slot-scope="data">
            <td :colspan="data.columns">
              <a href="javascript:void(0)" @click.prevent="getEvents" v-if="cursor">Показать больше событий</a>
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

import { round } from '@/helpers.js'

export default {
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
      filters: {
        depthMax: '',
        depthMin: '',
        hasMt: '',
        magMax: '',
        magMin: '',
        latMax: '',
        latMin: '',
        lonMax: '',
        lonMin: '',
        rmsMax: '',
        staNumMin: ''
      },
      highlightEventTreshold: this.$root.$options.settings.events.highlightTreshold,
      sortBy: 'datetime',
      sortDesc: true
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
  methods: {
    getEvents: function() {
      this.$http.get(`${this.$root.$options.settings.api.endpoints.events}?cursor=${this.cursor}&show_nearest_city=1&limit=10&`)
        .then(response => {
          this.events = this.events.concat(response.data.data)
          this.cursor = response.data.meta.cursor.next
        })
        .catch(error => { console.log(error) })
    },
    'openEvent': function(item) {
      this.$router.push({ name: 'Event', params: { hashid: item.hashid } })
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
    .infobar {
      background-color: $color-white-2;
      border: 1px $color-gray-light solid;
      border-radius: $border-radius;
      font-size: 90%;
      margin-bottom: 3%;
      margin-top: 3%;
      min-height: 50px;
      padding-left: 2%;
      padding-right: 2%;

      .fa {
        color: $color-orange;
        padding-right: 1%;
      }

      .events-count {
        color: $color-blue;
        font-weight: bold;
      }
    }

    .filters {
      border: 1px solid $color-gray-light-4;
      border-radius: $border-radius;
      margin-right: 3%;

      .filter {
        border-bottom: 1px solid $color-gray-light-4;
        padding-bottom: 6%;

        &:nth-last-child(2) {
          padding-top: 6%;
        }

        &:nth-last-child(1) {
          padding-top: 6%;

          .btn {
            box-shadow: none;
          }
        }

        .filter-title {
          font-size: 90%;
          font-weight: bold;
        }

        .filter-inputs {
          .input-group {
            height: 80%;

            input {
              text-align: center;
            }
          }

          // Left input.
          .col-5:first-child,
          .col:first-child, {
            padding-left: 3%
          }

          // Arrows.
          .middle-col {
            color: $color-gray-light-2;
          }

          // Right input.
          .col-5:last-child,
          .col:last-child, {
            padding-right: 3%
          }

          &:last-child {
            label {
              margin-bottom: 0;
            }
          }
        }

        .row:first-child {
          margin-bottom: 4%;
          margin-top: 4%;
        }

        .input-group-addon {
          background-color: $color-white-2;
          font-size: 80%;
        }

        .custom-checkbox {
          width: 100%;

          .custom-control-indicator {
            box-shadow: none;
            height: 22px;
            top: 1px;
            width: 22px;
          }

          .custom-control-description {
            margin-left: 3%;
          }

          .custom-control-input ~ .custom-control-indicator {
            border: 1px solid $color-gray-light-4;
          }

          .custom-control-input:checked ~ .custom-control-indicator {
            background-color: $color-blue;
          }

          .custom-control-input:checked ~ .custom-control-description {
            font-weight: bold;
          }

          .custom-control-input:not(:checked) ~ .custom-control-indicator {
            background-color: $color-white;
          }
        }
      }
    }

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
