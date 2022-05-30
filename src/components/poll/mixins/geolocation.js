import ts from '@mapbox/timespace'

export default {
  data() {
    return {
      location: {
        lat: null,
        lon: null
      },
      timezoneOffset: 0
    }
  },
  methods: {
    getTimezone() {
      const timestamp = Date.now()
      const point = [this.location.lat, this.location.lon]
      const time = ts.getFuzzyLocalTimeFromPoint(timestamp, point)
      this.timezoneOffset = time._d.getTimezoneOffset()
    },
    getCurrentLocation() {
      let vm = this
      window.navigator.geolocation.getCurrentPosition(
        function(position) {
          vm.location.lat = position.coords.latitude
          vm.location.lon = position.coords.longitude
          vm.getTimezone()
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
