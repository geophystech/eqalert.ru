<template>
  <div class="mainpage">
    <AppMap shouldDrawLastEvents="true" />

    <b-container>
      <b-row>
        <b-col class="events-analytics-block">
          <b-row>
            <b-col class="last-events">
              <b-row class="d-flex justify-content-center header">
                <h4>Тензор момента</h4>
              </b-row>
              <b-row class="event" align-v="center" v-for="event in events" :key="event.hashid">
                <router-link :to="{ name: 'Event', params: { hashid: event.hashid }}" class="d-flex align-items-center">
                  <b-col cols="2" class="magnitude text-center">{{ event.magnitude }}</b-col>
                  <b-col>
                    <div class="settlement">{{ event.nearest_settlement.distance }} км до {{ event.nearest_settlement.title }}</div>
                    <div class="datetime">{{ moment.utc(event.datetime).locale('ru').format('LL в HH:mm:ss UTC') }}, глубина {{ event.depth }} км</div>
                  </b-col>
                  <b-col cols="2" class="moment-tensor text-center">
                    <router-link :to="{ name: 'MomentTensor', params: { hashid: event.hashid }}">
                      <img :alt="event.hashid" :src="'https://eqalert.ru/uploads/images/moment_tensors/preview/' + event.moment_tensor.image_preview" class="img-responsive" />
                    </router-link>
                  </b-col>
                </router-link>
              </b-row>
            </b-col>

            <b-col>
              <b-row class="d-flex justify-content-center header">
                <h4>Аналитика</h4>
              </b-row>
              <b-row>
                <b-col>
                  <ChartByDatetime :chart-data="chartByDatetime" :height="300" />
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import AppMap from '@/components/AppMap'
import ChartByDatetime from './charts/ChartByDatetime'

const moment = require('moment')
require('moment/locale/ru')

export default {
  name: 'mainpage',
  components: { AppMap, ChartByDatetime },
  data () {
    return {
      events: [],
      chartByDatetime: {}
    }
  },
  computed: {
    moment: function () {
      return moment
    }
  },
  created () {
    this.getEvents()
    this.getDataForChartByDatetime()
  },
  methods: {
    getEvents: function () {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/14feed1393937c7ae8681177f35bb68e/raw/5413dfb1f5450e38d62af9e3690bbc4235926f11/eq_last_events_with_moment_tensor.json')
        .then(response => {
          this.events = response.data.events
        })
        .catch(error => { console.log(error) })
    },
    getDataForChartByDatetime: function () {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/7d2bb32a1f9fea48a8a969cae089d0b6/raw/2020b03b5ea212ae144e8b80a714f6360c21ca33/eq_by_datetime_chart.json')
        .then(response => {
          let chartData = this.$store.getters.datasetChartByDatetime
          chartData.datasets[0].data = response.data.data
          chartData.labels = response.data.labels
          this.chartByDatetime = chartData
        })
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  $border: 1px $color-gray-light solid;

  .events-analytics-block {
    border-top: $border;
    height: auto;
    margin-top: 3%;

    .header {
      padding-bottom: 3%;
      padding-top: 3%;
    }
  }

  .event {
    border-left: $border;
    border-right: $border;
    border-top: $border;
    padding-bottom: 2%;
    padding-top: 2%;

    &:hover {
      background-color: $color-white-2;
    }

    &:last-child {
      border-bottom: $border;
    }

    .magnitude {
      color: $color-orange;
      font-size: 180%;
    }

    .datetime {
      color: $color-gray-light-2;
      font-size: 85%;
    }

    .moment-tensor {
      img {
        max-width: 100%;
      }
    }

    a {
      color: $color-gray-dark;
      width: 100%;

      &:hover {
        text-decoration: none;
      }
    }
  }
</style>
