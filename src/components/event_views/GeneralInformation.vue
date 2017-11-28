<template>
  <div class="event-tab general-information">
    <AppMap :hashid="hashid" mapId="map-general-information" shouldDrawEpicenter="true" shouldDrawPga="true" target="generalInformation" />

    <b-table
      hover
      outlined
      :fields="fields"
      :items="items">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.auto="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

import AppMap from '@/components/AppMap'

export default {
  components: { AppMap },
  data() {
    return {
      items: [
        { parameter: 'Широта', value: null, error: null, description: 'Широта эпицентра в градусах и погрешность в километрах' },
        { parameter: 'Долгота', value: null, error: null, description: 'Долгота эпицентра в градусах и погрешность в километрах' },
        { parameter: 'Глубина', value: null, error: null, description: 'Глубина гиппоцентра и погрешность в километрах' },
        { parameter: 'Дата и время в очаге', value: null, error: null, description: 'Дата, время и погрешность определения времени в очаге' },
        { parameter: 'Ближайшая станция от эпицентра', value: null, error: null, description: 'Расстояние до ближайшей станции' },
        { parameter: 'Азимутальная брешь', value: null, error: null, description: 'Параметр характерезующий плотность сети вокруг эпицентра' },
        { parameter: 'RMS', value: null, error: null, description: 'Суммарная невязка по внутренней сходимости' },
        { parameter: 'Число станций', value: null, error: null, description: 'Количество станций задействованных в обработке для этого землетрясения' },
        { parameter: 'Метод обработки', value: null, error: null, description: 'Ручная или автоматическая обработка' }
      ],
      fields: [
        { key: 'index', label: '#' },
        { key: 'parameter', label: 'Параметр' },
        { key: 'value', label: 'Значение', 'class': 'text-center' },
        { key: 'error', label: 'Погрешность', 'class': 'text-center' },
        { key: 'description', label: ' ', 'class': 'text-center' }
      ]
    }
  },
  computed: {
    hashid: function() {
      return 'KEXKBvM0'
    },
    moment: function() {
      return moment
    }
  },
  created() {
    this.getEvent()
  },
  methods: {
    getEvent: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/e8b61b8885e4069a78854472c039360a/raw/b10ee6eb561dab972f2d520c3089ec50ac5b17e7/eq_QgpAn7OW_general_information.json')
        .then(response => {
          this.items[0].value = `${response.data.event.latitude}N`
          this.items[0].error = `± ${response.data.event.latitude_error} км`
          this.items[1].value = `${response.data.event.longitude}E`
          this.items[1].error = `± ${response.data.event.longitude_error} км`
          this.items[2].value = `${response.data.event.depth} км`
          this.items[2].error = `± ${response.data.event.depth_error} км`
          this.items[3].value = moment.utc(response.data.event.datetime).locale('ru').format('DD.MM.YYYY в HH:mm:ss UTC')
          this.items[3].error = `${response.data.event.origin_time_error} сек`
          this.items[4].value = `${response.data.event.station_near} км`
          this.items[5].value = `${response.data.event.hypo_gap}°`
          this.items[6].value = response.data.event.rms
          this.items[7].value = response.data.event.stations_number
          this.items[8].value = response.data.event.processing_method
        })
        .catch(error => { console.log(error) })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';

</style>
