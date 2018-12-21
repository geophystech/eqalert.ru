<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { addEpicenter, createMap, id, removeEpicenter, setView } from '@/map_functions.js'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
        colors: {
          0: 'green',
          1: 'yellow',
          2: 'orange',
          3: 'red'
        },
        coordinates: [],
        map: {
          epicenter: null,
          id: null,
          object: null,
          parts: []
        }
      }
    },
    methods: {
      addData: function(data) {
        data.forEach(ldo => {
          ldo.parts.data.forEach(part => {
            const coordinates = [[part.lat_first, part.lon_first], [part.lat_end, part.lon_end]]
            const damageLevel = part.damage ? part.damage.data.damage_level : 0
            const partPolyline = window.L.polyline(coordinates, { color: this.colors[damageLevel] })

            partPolyline.addTo(this.map.object)

            let message =
              `<table class="table table-hover table-sm table-responsive">
                <thead>
                  <tr>
                    <th class="text-center" colspan=2>Общая информация</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th class="align-middle" scope="row">Наименование</th>
                    <td>${ldo.name}</td>
                  </tr>
                  <tr>
                    <th scope="row">Год постройки</th>
                    <td>${part.built_year}</td>
                  </tr>
                  <tr>
                    <th scope="row">Глубина залегания</th>
                    <td>${part.height}</td>
                  </tr>
                  <tr>
                    <th scope="row">Проектная сейсмостойкость</th>
                    <td>${part.max_msk64} (MSK64)</td>
                  </tr>
                  <tr>
                    <th scope="row">Материал конструкций</th>
                    <td>${part.fabric_type}</td>
                  </tr>
                  <tr>
                    <th scope="row">Тип грунта</th>
                    <td>${this.soilType(part.soil_type)}</td>
                  </tr>

                  <tr>
                    <th class="text-center" colspan=2>Информация о сейсмических воздействиях</th>
                  </tr>`

            if (part.damage && part.damage.data.has_damage) {
              message +=
                `<tr>
                  <th scope="row">PGA</th>
                  <td>${part.damage.data.pga_value}</td>
                </tr>
                <tr>
                  <th scope="row">Вероятность повреждения</th>
                  <td>${damageLevel}</td>
                </tr>`
            } else {
              message +=
                `<tr>
                  <td class="text-center" colspan=2>сейсмическое воздействие не оказано</t>
                </tr>`
            }

            message +=
              `   <tr>
                    <th scope="row">Примечания</th>
                    <td>${part.notes}</td>
                  </tr>
                </tbody>
              </table>`

            partPolyline.bindPopup(message)

            let partColor = null

            partPolyline.on('mouseover', function(event) {
              partColor = this.options.color

              partPolyline.setStyle({ color: 'cyan' })
            })

            partPolyline.on('mouseout', function(event) {
              partPolyline.setStyle({ color: partColor })
            })
          })
        })

        this.putEpicenter()
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.coordinates)
      },
      initialize: function() {
        this.map.id = id(this.event.id, this.tab)
        this.coordinates = [this.event.locValues.data.lat, this.event.locValues.data.lon]
      },
      putEpicenter: function() {
        this.map.epicenter = addEpicenter(this.map.object, this.coordinates)
      },
      removeData: function() {
        // Remove building markers.
        if (this.map.markers) this.map.object.removeLayer(this.map.markers)
      },
      resetMap: function() {
        removeEpicenter(this.map.object, this.map.epicenter)
        this.removeData()
        setView(this.map.object, this.coordinates)
      },
      soilType: function(type) {
        switch (type) {
          case 0: return 'не задан'
          case 1: return 'природные скальные грунты'
          case 2: return 'природные дисперсные грунты'
          case 3: return 'природные мерзлые грунты'
          case 4: return 'техногенные грунты'
        }
      }
    },
    created() {
      this.initialize()

      this.$root.$on('onMapLDOsDataFetched', data => { this.addData(data) })
    },
    beforeDestroy() {
      this.$root.$off('onMapLDOsDataFetched')
    },
    mounted() {
      this.createMap()
    },
    watch: {
      event: function(data) {
        this.initialize()
        this.resetMap()
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';
</style>

