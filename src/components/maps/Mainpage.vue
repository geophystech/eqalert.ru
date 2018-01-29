<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { createMap } from '@/map_functions.js'

  export default {
    data() {
      return {
        map: {
          coordinates: [50.351, 142.395],
          id: 'map-mainpage',
          object: null,
          events: []
        }
      }
    },
    methods: {
      addStations: function(stations) {
        stations.forEach(station => {
          let marker = new window.L.RegularPolygonMarker(new window.L.LatLng(station.sta_lat, station.sta_lon), {
            numberOfSides: 3,
            rotation: 30.0,
            radius: 7,
            fillOpacity: 1.0,
            color: false,
            fillColor: this.$root.$options.settings.stations.colors[station.scnl_network]
          })

          let message =
            `<table class="table table-hover table-sm table-responsive">
              <thead>
                <tr>
                  <th class="text-center" colspan=2>${station.scnl_name}.${station.scnl_network}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Каналов</th>
                  <td>${station.channel_num}</td>
                </tr>
                <tr>
                  <th scope="row">Высота</th>
                  <td>${station.sta_elevation}</td>
                </tr>
                <tr>
                  <th scope="row">Тип датчика</th>
                  <td>${station.instrument}</td>
                </tr>
                <tr>
                  <th scope="row">Регистратор</th>
                  <td>${station.datalogger}</td>
                </tr>
                <tr>
                  <th scope="row">Частота дискр.</th>
                  <td>${station.sample_rate}</td>
                </tr>
                <tr>
                  <th scope="row">Телеметрия</th>
                  <td>${station.has_realtime}</td>
                </tr>
                <tr>
                  <th scope="row">Оператор</th>
                  <td>${station.operator}</td>
                </tr>
              </tbody>
            </table>`

          marker.bindPopup(message)
          this.map.object.addLayer(marker)
        })
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.map.coordinates)
      },
      fetchStations: function() {
        this.$http.get(this.$root.$options.settings.api.endpointStations)
          .then(response => { this.addStations(response.data.data) })
          .catch(error => { console.log(error) })
      }
    },
    mounted() {
      this.createMap()
      this.fetchStations()
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/event_map';
</style>

