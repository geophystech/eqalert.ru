<template>
  <div class="analytics">
    <CountersHeader
      :count="eventsCount"
      :startDate="startDate"
      :endDate="endDate" />

    <b-row no-gutters>
      <Filters />
      <b-col>
        <h4 class="text-center">Количество землетрясений</h4>
        <ChartByDatetime :height="200" @update="chartByDatetimeUpdate" />

        <h4 class="text-center">Кумулятивный график повторяемости (ML)</h4>
        <ChartByMagnitudeCumulative :height="200" />

        <h4 class="text-center">Плотностное распределение повторяемости (ML)</h4>
        <ChartByDensityCounts :height="200" />

        <h4 class="text-center">События по количеству станций</h4>
        <ChartByStationCounts :height="200" />

        <h4 class="text-center">Распределение RMS</h4>
        <ChartByRMSAllocation :height="200" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
  import CountersHeader from '@/components/CountersHeader'
  import Filters from '@/components/Filters'
  import ChartByDatetime from '@/components/charts/ChartByDatetime'
  import ChartByDensityCounts from '@/components/charts/ChartByDensityCounts'
  import ChartByMagnitudeCumulative from '@/components/charts/ChartByMagnitudeCumulative'
  import ChartByRMSAllocation from '@/components/charts/ChartByRMSAllocation'
  import ChartByStationCounts from '@/components/charts/ChartByStationCounts'

  export default {
    components: {
      ChartByDatetime,
      ChartByDensityCounts,
      ChartByMagnitudeCumulative,
      ChartByRMSAllocation,
      ChartByStationCounts,
      CountersHeader,
      Filters
    },
    data() {
      return {
        eventsCount: 0,
        startDate: '',
        endDate: ''
      }
    },
    metaInfo: {
      title: 'Аналитика'
    },
    methods: {
      // The method is used to get data from the `ChartByDatetime` component.
      chartByDatetimeUpdate: function(data) {
        this.eventsCount = data.eventsCount
        this.startDate = data.startDate
        this.endDate = data.endDate
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
