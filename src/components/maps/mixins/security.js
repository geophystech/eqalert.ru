export default {
  data() {
    return {
      interval: null
    }
  },
  methods: {
    removePoliticalAttributes: function() {
      let foundAttributes = document.querySelectorAll('.leaflet-control-container .leaflet-control-attribution')
      if (foundAttributes.length) {
        let coreElement = foundAttributes[0].querySelectorAll('a')[0]
        let coreElementSeparator = foundAttributes[0].querySelectorAll('span')[0]
        coreElement.innerHTML = ''
        coreElementSeparator.innerHTML = ''
        clearInterval(this.interval)
      }
    }
  },
  mounted() {
    this.interval = setInterval(() => { this.removePoliticalAttributes() })
  }
}
