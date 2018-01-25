<template>
  <div class="map" :id="mapId" />
</template>

<script>
  import { addEpicenter, createMap, id, convertMsk64, msk64Color } from '@/map_functions.js'

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

        data.forEach(item => {
          const value = convertMsk64(item.value)
          const color = msk64Color(value)

          const circle = window.L.circle(this.coordinates, item.distance * 1000, { color: color, fillColor: color })

          circle.addTo(this.map)
          circle.bindPopup(`<div class="text-center"><strong>${value}</strong></div>`)

          legendData += `<i style="background: ${color}"></i>${value}<br>`
        })

        if (data.length) {
          const legend = window.L.control({ position: 'bottomright' })

          legend.onAdd = function() {
            const div = window.L.DomUtil.create('div', 'map-legend')
            div.innerHTML = legendData

            return div
          }

          legend.addTo(this.map)
        }

        addEpicenter(this.map, this.coordinates)
      },
      createMap: function() {
        this.map = createMap(this.mapId, this.coordinates)
      },
      fetchData: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEventMsk64(this.event.id))
          .then(response => { this.addData(response.data.data) })
          .catch(error => { console.log(error) })
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

