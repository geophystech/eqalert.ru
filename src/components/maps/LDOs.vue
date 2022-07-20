<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import {addEpicenter, createMap, id, mapLDOsLayerCreate, removeEpicenter, setView} from '@/map_functions'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
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
      addData: function(data)
      {
        const map = this.map.object

        data.forEach(ldo => {
          mapLDOsLayerCreate(ldo, map)
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

