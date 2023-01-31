<template>
  <div class="analytics">
    <BasicCountersHeader
      :filtersData="filtersParams"
      :count="eventsCount"
      :startDate="startDate"
      :endDate="endDate" />

    <b-row no-gutters>
      <AnalyticsFilters :disabled="disabledFilters" @filtersUpdated="filtersUpdated" key="analytics-filters" v-if="!$root.onMobile" />
      <b-col cols="8">
        <h4 class="text-center">Количество землетрясений</h4>
        <ChartByDatetime :height="200" @update="chartByDatetimeUpdate" :filtersParams="filtersParams" />

        <h4 class="text-center">Кумулятивный график повторяемости (ML)</h4>
        <ChartByMagnitudeCumulative :height="200" :filtersParams="filtersParams" />

        <h4 class="text-center">Плотностное распределение повторяемости (ML)</h4>
        <ChartByDensityCounts :height="200" :filtersParams="filtersParams" />

        <h4 class="text-center">События по количеству станций</h4>
        <ChartByStationCounts :height="200" :filtersParams="filtersParams" />

        <h4 class="text-center">Распределение RMS</h4>
        <ChartByRMSAllocation :height="200" :filtersParams="filtersParams" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      disabledFilters: false,
      filtersParams: {},
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
    },
    filtersUpdated: function(data) {
      this.filtersParams = data
    }
  }
}
</script>
