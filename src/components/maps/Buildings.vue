<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { addEpicenter, buildingColor, createMap, id, removeEpicenter, setView, createMapMarkerPopupBuilding } from '@/map_functions.js'

  export default {
    props: ['event', 'tab'],
    data() {
      return {
        coordinates: [],
        map: {
          epicenter: null,
          id: null,
          object: null,
          markers: []
        }
      }
    },
    methods: {
      addData: function(data) {
        let markers = new window.L.MarkerClusterGroup({
          disableClusteringAtZoom: 15
        })

        data.forEach(building => {
          if (building.damage_level < 1) return

          const options = {
            fillColor: buildingColor(building.damage_level),
            dropShadow: true,
            gradient: true,
            innerRadius: 0,
            radius: 7
          }
          const {lat: latitude, lon: longitude} = building.building.data
          const coordinates = new window.L.LatLng(latitude, longitude)
          const marker = new window.L.MapMarker(coordinates, options)

          marker.bindPopup(createMapMarkerPopupBuilding(building))
          markers.addLayer(marker)
        })

        this.map.markers = markers
        this.map.object.addLayer(markers)

        if (!this.$el.querySelector('.map-legend')) {
          const legend = window.L.control({ position: 'bottomright' })

          legend.onAdd = map => {
            let div = window.L.DomUtil.create('div', 'map-legend')
            div.innerHTML =
              `<div class="buildings-legend"><span style="background: ${buildingColor(1)}"></span><span>d-1</span></div>
               <div class="buildings-legend"><span style="background: ${buildingColor(2)}"></span><span>d-2</span></div>
               <div class="buildings-legend"><span style="background: ${buildingColor(3)}"></span><span>d-3 - d-5</span></div>`
            return div
          }

          legend.addTo(this.map.object)
        }

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

      this.$root.$on('onMapBuildingsDataFetched', data => { this.addData(data) })
    },
    beforeDestroy() {
      this.$root.$off('onMapBuildingsDataFetched')
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
  @import '../../assets/scss/event_map';
</style>

