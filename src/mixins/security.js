export default {
  methods: {
    removePoliticalAttributes: function() {
      let foundAttributes = document.querySelectorAll('.leaflet-control-container .leaflet-control-attribution')
      if (foundAttributes.length) {
        let coreElement = foundAttributes[0].querySelectorAll('a')[0]
        let coreElementSeparator = foundAttributes[0].querySelectorAll('span')[0]
        coreElement.innerHTML = ''
        coreElementSeparator.innerHTML = ''
      }
    }
  },
  mounted() {
    setTimeout(() => { this.removePoliticalAttributes() }, 50) // first attempt to hide attributes
    setInterval(() => { this.removePoliticalAttributes() }, 1000) // every 1 sec
  }
}
