<template>
  <div class="event-tab">
    <b-table
      hover
      outlined
      responsive
      :fields="fields"
      :items="items">
      <template slot="index" slot-scope="data">{{ data.index + 1 }}</template>
      <template slot="description" slot-scope="data">
        <img src="../../assets/img/question-circle.png" alt="Описание" v-b-popover.hover.right="data.value" />
      </template>
    </b-table>
  </div>
</template>

<script>
  import { agency } from '@/helpers/event'

  export default {
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
          { parameter: 'Метод обработки', value: null, error: null, description: 'Ручная или автоматическая обработка' },
          { parameter: 'Агентство', value: null, error: null, description: 'Источник данных' }
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
    created() {
      this.setData(this.event)
    },
    methods: {
      setData: function(data) {
        this.items[0].value = `${data.locValues.data.lat}N`
        this.items[0].error = `± ${data.locValues.data.lat_err} км`
        this.items[1].value = `${data.locValues.data.lon}E`
        this.items[1].error = `± ${data.locValues.data.lon_err} км`
        this.items[2].value = `${data.locValues.data.depth} км`
        this.items[2].error = `± ${data.locValues.data.depth_err} км`
        this.items[3].value = this.$moment(data.locValues.data.event_datetime).format('DD.MM.YYYY в HH:mm:ss UTC')
        this.items[3].error = `${data.locValues.data.origin_time_err} сек`
        this.items[4].value = `${data.locValues.data.station_near} км`
        this.items[5].value = `${data.locValues.data.hypo_gap}°`
        this.items[6].value = data.locValues.data.rms
        this.items[7].value = data.locValues.data.sta_num
        this.items[8].value = data.processingMethod.long
        this.items[9].value = agency(data.agency)
      }
    },
    watch: {
      event: function() {
        this.setData(this.event)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~scss/event';
</style>
