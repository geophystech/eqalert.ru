<template>
  <div class="map" :id="mapId" />
</template>

<script>
  import { addEpicenter, buildingColor, createMap, id } from '@/map_functions.js'

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
        let markers = new window.L.MarkerClusterGroup({ disableClusteringAtZoom: 15 })

        data.forEach(building => {
          if (building.damage_level < 1) return

          const buildingType = building.building.data.building_type
          const buildingBaseType = building.building.data.building_base_type
          const builtYear = building.building.data.built_year
          const damageLevel = building.damage_level
          const fabricType = building.building.data.fabric_type
          const flats = building.building.data.flats
          const latitude = building.building.data.lat
          const longitude = building.building.data.lon
          const maxMSK64 = building.building.data.max_msk64
          const options = {
            dropShadow: true,
            fillColor: buildingColor(damageLevel),
            gradient: true,
            innerRadius: 0,
            radius: 7
          }
          const PGAValue = building.pga_value || 0.0
          const residents = building.building.data.residents
          const street = building.building.data.street
          const streetNumber = building.building.data.street_number

          const coordinates = new window.L.LatLng(latitude, longitude)
          const marker = new window.L.MapMarker(coordinates, options)

          const message =
            `<table class="table table-hover table-sm table-responsive">
              <tbody>
                <tr>
                  <th class="align-middle" scope="row">Тип строения</th>
                  <td>${buildingType}</td>
                </tr>
                <tr>
                  <th scope="row">Тип фундамента</th>
                  <td>${buildingBaseType}</td>
                </tr>
                <tr>
                  <th scope="row">Материал</th>
                  <td>${fabricType}</td>
                </tr>
                <tr>
                  <th scope="row">Год постройки</th>
                  <td>${builtYear}</td>
                </tr>
                <tr>
                  <th scope="row">Кол-во этажей</th>
                  <td>${flats}</td>
                </tr>
                <tr>
                  <th scope="row">Адрес</th>
                  <td>${street}, д. ${streetNumber}</td>
                </tr>
                <tr>
                  <th scope="row">Кол-во проживающих</th>
                  <td>${residents}</td>
                </tr>
                <tr>
                  <th scope="row">Максимальная бальность</th>
                  <td>${maxMSK64} (MSK64)</td>
                </tr>
                <tr>
                  <th scope="row">Прогноз повреждений</th>
                  <td>d-${damageLevel}</td>
                </tr>
                <tr>
                  <th scope="row">PGA</th>
                  <td>${PGAValue}</td>
                </tr>
                <tr>
                  <th scope="row">По данным</th>
                  <td><a href="http://www.fkr65.ru">www.fkr65.ru</a></td>
                </tr>
              </tbody>
            </table>`

          marker.bindPopup(message)
          markers.addLayer(marker)
        })

        this.map.addLayer(markers)

        const legend = window.L.control({ position: 'bottomright' })

        legend.onAdd = map => {
          let div = window.L.DomUtil.create('div', 'map-legend')
          div.innerHTML =
            `<div class="buildings-legend"><span style="background: ${buildingColor(1)}"></span><span>d-1</span></div>
            <div class="buildings-legend"><span style="background: ${buildingColor(2)}"></span><span>d-2</span></div>
            <div class="buildings-legend"><span style="background: ${buildingColor(3)}"></span><span>d-3</span></div>
            `
          return div
        }

        legend.addTo(this.map)
        addEpicenter(this.map, this.coordinates)
      },
      createMap: function() {
        this.map = createMap(this.mapId, this.coordinates)
      }
    },
    created() {
      this.mapId = id(this.event.id, this.tab)
      this.coordinates.push(this.event.locValues.data.lat, this.event.locValues.data.lon)

      this.$root.$on('onMapDataFetched', data => { this.addData(data) })
    },
    beforeDestroy() {
      this.$root.$off('onMapDataFetched')
    },
    mounted() {
      this.createMap()
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/event_map';
</style>

