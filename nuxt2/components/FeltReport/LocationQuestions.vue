<template>
  <div class="location-questions__container">
    <div>
      <b-form-group>
        <template slot="label">
          Укажите свое местоположение <span style="color: red" title="Обязательный вопрос">*</span>
        </template>
        <div :id="map.id"></div>
      </b-form-group>
    </div>
    <hr/>
  </div>
</template>

<script>
import {createMap} from '@/config/map_functions'

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
        iconUrl: '/img/marker.png',
        iconSize: [30, 30]
      })
      const location = {
        lat: parseFloat(event.latlng.lat.toFixed(9)),
        lon: parseFloat(event.latlng.lng.toFixed(9))
      }
      this.$emit('update', location)
      this.marker = window.L.marker(event.latlng, {icon}).addTo(this.map.object)
    },
    getCurrentPosition() {
      let vm = this
      window.navigator.geolocation.getCurrentPosition(
        function(position) {
          vm.map.coordinates = [position.coords.latitude, position.coords.longitude]
          vm.map.object = createMap(
            vm.map.id,
            vm.map.coordinates,
            {
              zoom: 10,
              store: vm.$store,
              axios: vm.$axios,
            }
          )
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
          vm.map.object = createMap(
            vm.map.id,
            vm.map.coordinates,
            {
              zoom: 10,
              store: vm.$store,
              axios: vm.$axios,
            })
          vm.watchMapClick()
        }
      )
    }
  },
  mounted() {
    if (window.navigator.geolocation) {
      this.getCurrentPosition()
    }
    else {
      console.warn('GeoLocation API is unavailable for your browser')
    }
  }
}
</script>

<style lang="scss">
.location-questions__container {
  #felt-report-map {
    width: 100%;
    height: 400px;
  }
  .form-group {
    legend {
      font-size: 1.25rem;
      font-weight: 700;
    }
  }
}
</style>
