<template>
  <div class="events">
    <b-row class="infobar" align-v="center" no-gutters>
      <b-col>
        <i class="fa fa-lg fa-lock align-middle" aria-hidden="true" />
        <router-link to="/">Снять ограничения данных</router-link>
      </b-col>
      <b-col cols="8">Загружено <span class="events-count">{{ events.length }}</span> событий (04.09.2017 — 08.10.2017)</b-col>
    </b-row>

    <b-row no-gutters>
      <b-col class="filters" cols="3">фильтры</b-col>
      <b-col class="all-events">
        <b-table
          hover
          responsive
          :fields="fields"
          :items="events"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc">
          <template slot="index" scope="data">{{ data.index + 1 }}</template>
          <template slot="magnitude" scope="data">
            <span :class="{ 'highlight-event': data.value > highlightEventTreshold }">{{ data.value }}</span>
          </template>
          <template slot="depth" scope="data">{{ data.value }} км</template>
          <template slot="datetime" scope="data">{{ moment.utc(data.value).locale('ru').format('LL в HH:mm:ss UTC') }}</template>
          <template slot="settlement" scope="data">
            <span v-if="data.value.title === null">Нет данных</span>
            <span v-else>{{ data.value.distance }} км до {{ data.value.title }}</span>
          </template>
        </b-table>
      </b-col>
    </b-row>
    </div>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

export default {
  data() {
    return {
      events: [],
      fields: [
        { key: 'index', label: '#' },
        { key: 'magnitude', label: 'Магнитуда', sortable: true },
        { key: 'depth', label: 'Глубина', sortable: true },
        { key: 'datetime', label: 'Дата и время', sortable: true },
        { key: 'settlement', label: 'Ближайший населенный пункт', sortable: true }
      ],
      highlightEventTreshold: this.$store.getters.highlightEventTreshold,
      sortBy: 'datetime',
      sortDesc: true
    }
  },
  computed: {
    moment: function() {
      return moment
    }
  },
  methods: {
    getEvents: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/68aaa3ec79647d0599287f735b288e2c/raw/6974efa90788178207afa2a3c2ce1c3da38e3bb3/eq_events.json')
        .then(response => {
          this.events = response.data.events
        })
        .catch(error => { console.log(error) })
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

    .all-events {
      font-size: 90%;

      table {
        border: 1px solid $color-gray-light-4;
        text-align: center;

        thead {
          background-color: $color-white-2;

          tr {
            th {
              text-align: center;
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
