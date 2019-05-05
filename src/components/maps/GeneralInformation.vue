<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { addEpicenter, createMap, id, removeEpicenter, setView } from '@/map_functions'
  import { numberDeclension } from '@/helpers/number'
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
          pga: []
        }
      }
    },
    methods: {
      addData: function(data) {
        
        let legendData = `
          <table>
            <thead>
              <tr>
                <th>ШСИ</th>
                <th></th>
                <th>%g</th>
              </tr>
            </thead>
            <tbody>`

        Object.keys(data).forEach((key) => {

          const lineColor = this.pgaLineColor(key)
          const pga = window.L.polygon(data[key].data, { color: lineColor, weigh: 2 })

          this.map.pga.push(pga)
          pga.addTo(this.map.object)

          const nextRange = data[parseInt(key) + 1]
          let intensityLegendValue = this.pgaToIntensity(data[key].range)
          let pgaLegendValue = data[key].range
          let intensityPopupRange = intensityLegendValue
          let pgaPopupRange = data[key].range

          if (nextRange) {
            intensityPopupRange += ` - ${this.pgaToIntensity(nextRange.range)}`
            pgaPopupRange += ` - ${nextRange.range}`
          } else {
            intensityLegendValue += `+`
            pgaLegendValue += `+`
            pgaPopupRange += `+`
          }

          legendData += `
            <tr>
              <td align="right">${intensityLegendValue}</td>
              <td><i style="background: ${lineColor}; margin-left: 8px;"></i></td>
              <td>${pgaLegendValue}</td>
            </tr>`

          const popupMessage = `
            Пиковое ускорение грунта: ${pgaPopupRange}%g <br>
            Интенсивность по ШСИ-2017: ${intensityPopupRange} ${numberDeclension(intensityLegendValue, ['балл', 'балла', 'баллов'])}
          `

          pga.bindPopup(popupMessage)
        })

        // Show map legend just once.
        if (!this.$el.querySelector('.map-legend')) {
          let pgaLegend = window.L.control({ position: 'bottomright' })

          pgaLegend.onAdd = (map) => {
            const div = window.L.DomUtil.create('div', 'map-legend')
            div.innerHTML += legendData + `</tbody></table>`

            return div
          }

          pgaLegend.addTo(this.map.object)
        }
        this.putEpicenter()
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.coordinates)
      },
      fetchData: function()
      {
        if (!this.event.has_pga_data) {
          return this.putEpicenter()
        }

        this.$http.get(apiSettings.endpointEventPga(this.event.id))
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
      pgaLineColor: function(index) {
        const colors = ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d']

        return colors[index - 1]
      },
      pgaToIntensity: function(pga) {
        switch (pga) {
          case '0.175': return 2.5
          case '0.28': return 3
          case '0.7': return 4
          case '1.75': return 5
          case '4.4': return 6
          case '11.0': return 7
          case '28.0': return 8
          case '70.0': return 9
          case '110.0': return 9.5
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
  @import '~scss/event_map';
</style>

