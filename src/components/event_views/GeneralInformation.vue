<template>
  <div class="event-tab general-information">
    <AppMap :hashid="event.id" mapId="map-general-information" shouldDrawEpicenter="true" shouldDrawPga="true" target="generalInformation" v-if="event.id" />

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
  props: ['event'],
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
    moment: function() {
      return moment
    }
  },
  watch: {
    event: function(value) {
      this.items[0].value = `${value.locValues.data.lat}N`
      this.items[0].error = `± ${value.locValues.data.lat_err} км`
      this.items[1].value = `${value.locValues.data.lon}E`
      this.items[1].error = `± ${value.locValues.data.lon_err} км`
      this.items[2].value = `${value.locValues.data.depth} км`
      this.items[2].error = `± ${value.locValues.data.depth_err} км`
      this.items[3].value = moment.utc(value.locValues.data.event_datetime).locale('ru').format('DD.MM.YYYY в HH:mm:ss UTC')
      this.items[3].error = `${value.locValues.data.origin_time_err} сек`
      this.items[4].value = `${value.locValues.data.station_near} км`
      this.items[5].value = `${value.locValues.data.hypo_gap}°`
      this.items[6].value = value.locValues.data.rms
      this.items[7].value = value.locValues.data.sta_num
      this.items[8].value = value.processingMethod.long
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';
</style>
