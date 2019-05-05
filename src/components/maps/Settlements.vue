<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { addEpicenter, createMap, id, convertMsk64, msk64Color, removeEpicenter, setView } from '@/map_functions'
  import apiSettings from '@/settings/api'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
        coordinates: [],
        map: {
          epicenter: null,
          id: null,
          object: null,
          circles: []
        }
      }
    },
    methods: {
      addData: function(data) {
        let legendData = ''

        data.forEach(item => {
          const value = convertMsk64(item.value)
          const color = msk64Color(value)

          const circle = window.L.circle(this.coordinates, item.distance * 1000, { color: color, fillColor: color })

          this.map.circles.push(circle)
          circle.addTo(this.map.object)
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

          legend.addTo(this.map.object)
        }

        this.putEpicenter()
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.coordinates)
      },
      fetchData: function() {
        this.$http.get(apiSettings.endpointEventMsk64(this.event.id))
          .then(response => { this.addData(response.data.data) })
      },
      initialize: function() {
        this.map.id = id(this.event.id, this.tab)
        this.coordinates = [this.event.locValues.data.lat, this.event.locValues.data.lon]
      },
      putEpicenter: function() {
        this.map.epicenter = addEpicenter(this.map.object, this.coordinates)
      },
      removeData: function() {
        // Remove map legend and MSK64 circles.
        const legend = this.$el.querySelector('.map-legend')
        if (legend) legend.remove()
        this.map.circles.forEach(circle => { this.map.object.removeLayer(circle) })
      },
      resetMap: function() {
        removeEpicenter(this.map.object, this.map.epicenter)
        this.removeData()
        setView(this.map.object, this.coordinates)
      }
    },
    created() {
      this.initialize()
    },
    mounted() {
      this.createMap()
      this.fetchData()
    },
    watch: {
      event: function(data) {
        this.initialize()
        this.resetMap()
        this.fetchData()
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';
</style>

