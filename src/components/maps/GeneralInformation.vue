<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { addEpicenter, createMap, id, removeEpicenter, setView } from '@/map_functions.js'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
        coordinates: [],
        map: {
          epicenter: null,
          id: null,
          object: null,
          pga: []
        }
      }
    },
    methods: {
      addData: function(data) {
        let legendData = ''

        Object.keys(data).forEach((key) => {
          const lineColor = this.pgaLineColor(data[key].range)
          const pga = window.L.polygon(data[key].data, { color: lineColor, weigh: 2 })

          this.map.pga.push(pga)
          pga.addTo(this.map.object)
          pga.bindPopup(`Пиковое ускорение грунта: ${data[key].range}%g (ускорение свободного падения)`)

          legendData += `<i style="background: ${lineColor}"></i>${data[key].range}<br>`
        })

        // Show map legend just once.
        if (!this.$el.querySelector('.map-legend')) {
          let pgaLegend = window.L.control({ position: 'bottomright' })

          pgaLegend.onAdd = (map) => {
            const div = window.L.DomUtil.create('div', 'map-legend')
            div.innerHTML += '<h6>%g</h6>'
            div.innerHTML += legendData

            return div
          }

          pgaLegend.addTo(this.map.object)
        }
        this.putEpicenter()
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.coordinates)
      },
      fetchData: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEventPga(this.event.id))
          .then(response => {
            this.addData(response.data.data)
          })
          .catch(error => {
            console.log(error)
            this.putEpicenter()
          })
      },
      initialize: function() {
        this.map.id = id(this.event.id, this.tab)
        this.coordinates = [this.event.locValues.data.lat, this.event.locValues.data.lon]
      },
      pgaLineColor: function(range) {
        switch (range) {
          case '0.15': return '#fff5f0'
          case '0.3': return '#fee0d2'
          case '2.8': return '#fcbba1'
          case '6.2': return '#fc9272'
          case '12.0': return '#fb6a4a'
          case '22.0': return '#ef3b2c'
          case '40.0': return '#cb181d'
          case '75.0': return '#a50f15'
          case '139.0': return '#67000d'
        }
      },
      putEpicenter: function() {
        this.map.epicenter = addEpicenter(this.map.object, this.coordinates)
      },
      removeData: function() {
        // Remove PGA polylines.
        this.map.pga.forEach(layer => { this.map.object.removeLayer(layer) })
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
  @import '../../assets/scss/event_map';
</style>

