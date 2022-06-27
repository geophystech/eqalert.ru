<template>
  <div class="location-questions__container">
    <div>
      <div :id="map.id"></div>
    </div>
    <hr/>
  </div>
</template>

<script>
import {createMap} from '@/map_functions'

export default {
  name: 'LocationQuestions',
  data() {
    return {
      map: {
        id: 'felt-report-map',
        coordinates: [58.651, 142.395],
        object: null,
        marker: null
      }
    }
  },
  methods: {
    watchMapClick: function() {
      let vm = this
      this.map.object.on('click', function(event) {
        if (vm.marker) {
          vm.map.object.removeLayer(vm.marker)
        }
        vm.addMarker(event)
      })
    },
    addMarker: function(event) {
      const icon = window.L.icon({
        iconUrl: '/static/img/marker.png',
        iconSize: [30, 30]
      })
      this.$emit('update', {lat: event.latlng.lat, lon: event.latlng.lng})
      this.marker = window.L.marker(event.latlng, {icon}).addTo(this.map.object)
    }
  },
  mounted() {
    let vm = this
    window.navigator.geolocation.getCurrentPosition(
      function(position) {
        vm.map.coordinates = [position.coords.latitude, position.coords.longitude]
        vm.map.object = createMap(vm.map.id, vm.map.coordinates, {zoom: 10})
        vm.addMarker({latlng: {lat: position.coords.latitude, lng: position.coords.longitude}})
        vm.watchMapClick()
      },
      function(error) {
        const errorTypes = {
          1: 'PERMISSION_DENIED',
          2: 'POSITION_UNAVAILABLE',
          3: 'TIMEOUT'
        }
        console.error(error.message, {code: errorTypes[error.code]})
        vm.map.object = createMap(vm.map.id, vm.map.coordinates, {zoom: 10})
        vm.watchMapClick()
      }
    )
  }
}
</script>

<style lang="scss">
.location-questions__container {
  #felt-report-map {
    width: 100%;
    height: 400px;
  }
}
</style>
