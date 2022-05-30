export default {
  data() {
    return {
      location: {
        lat: null,
        lon: null
      }
    }
  },
  methods: {
    getCurrentLocation() {
      window.navigator.geolocation.getCurrentPosition(
        function(position) {
          this.location.lat = position.coords.latitude
          this.location.lon = position.coords.longitude
        },
        function(error) {
          const errorTypes = {
            1: 'PERMISSION_DENIED',
            2: 'POSITION_UNAVAILABLE',
            3: 'TIMEOUT'
          }
          console.error(error.message, {code: errorTypes[error.code]})
        }
      )
    }
  },
  mounted() {
    if (window.navigator.geolocation) {
      this.getCurrentLocation()
    }
    else {
      console.warn('GeoLocation API is unavailable for your browser')
    }
  }
}
