import ts from '@mapbox/timespace'

export default {
  data() {
    return {
      timezoneOffset: 0,
      timezone: 'UTC'
    }
  },
  methods: {
    formatTimezone(offset) {
      const hours = Math.abs(offset) / 60
      const minutes = Math.abs(offset) % 60
      if (offset === 0) {
        return 'UTC'
      }
      const formattedHours = hours > 9 ? `${hours}` : `0${hours}`
      const formattedMinutes = minutes > 9 ? `${minutes}` : `0${minutes}`
      const formattedSign = offset < 0 ? '+' : '-'
      return `UTC${formattedSign}${formattedHours}:${formattedMinutes}`
    },
    getTimezone() {
      const timestamp = Date.now()
      const point = [this.location.lat, this.location.lon]
      const time = ts.getFuzzyLocalTimeFromPoint(timestamp, point)
      this.timezoneOffset = time._d.getTimezoneOffset()
      this.timezone = this.formatTimezone(this.timezoneOffset)
    }
  }
}
