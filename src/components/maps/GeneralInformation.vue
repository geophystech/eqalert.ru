<template>
  <div class="map" :id="mapId" />
</template>

<script>
  import { addEpicenter, createMap, id } from '@/map_functions.js'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
        coordinates: [],
        map: null,
        mapId: ''
      }
    },
    methods: {
      addData: function(data) {
        let legendData = ''

        Object.keys(data).forEach((key) => {
          const lineColor = this.pgaLineColor(data[key].range)
          const pga = window.L.polygon(data[key].data, { color: lineColor, weigh: 2 })

          pga.addTo(this.map)
          pga.bindPopup(`Пиковое ускорение грунта: ${data[key].range}%g (ускорение свободного падения)`)

          legendData += `<i style="background: ${lineColor}"></i>${data[key].range}<br>`
        })

        let pgaLegend = window.L.control({ position: 'bottomright' })

        pgaLegend.onAdd = (map) => {
          const div = window.L.DomUtil.create('div', 'map-legend')
          div.innerHTML += '<h6>%g</h6>'
          div.innerHTML += legendData

          return div
        }

        pgaLegend.addTo(this.map)

        addEpicenter(this.map, this.coordinates)
      },
      createMap: function() {
        this.map = createMap(this.mapId, this.coordinates)
      },
      fetchData: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEventPga(this.event.id))
          .then(response => { this.addData(response.data.data) })
          .catch(error => { console.log(error) })
      },
      pgaLineColor: function(range) {
        switch (range) {
          case '<=0.15': return '#fff5f0'
          case '0.15-0.3': return '#fee0d2'
          case '0.3-2.8': return '#fcbba1'
          case '2.8-6.2': return '#fc9272'
          case '6.2-12': return '#fb6a4a'
          case '12-22': return '#ef3b2c'
          case '22-40': return '#cb181d'
          case '40-75': return '#a50f15'
          case '75-139': return '#67000d'
          case '>139': return '#400000'
        }
      }
    },
    created() {
      this.mapId = id(this.event.id, this.tab)
      this.coordinates.push(this.event.locValues.data.lat, this.event.locValues.data.lon)
    },
    mounted() {
      this.createMap()
      this.fetchData()
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/event_map';
</style>

