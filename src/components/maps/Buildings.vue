<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import {
    addEpicenter, buildingColor, createMap, id, removeEpicenter, setView, createMapBuildingMarker,
    createMapMarkerClusterGroup, mapCentering
  } from '@/map_functions'

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

      addData: function(buildings)
      {
        let damageLevelMarkers = {}
        let destroyedMarkers = []
        let destroyedLevels = []
        let damageLevels = []
        let coordinates = []

        buildings.forEach(building => {

          let dLevel = building.damage_level
          building = building.building.data

          if (!dLevel && !building.destroyed) return

          let marker = createMapBuildingMarker(building, dLevel)
          coordinates.push([building.lat, building.lon])

          if(building.destroyed > dLevel)
          {
            if (destroyedLevels.indexOf(building.destroyed) === -1) {
              destroyedLevels.push(building.destroyed)
            }

            return destroyedMarkers.push(marker)
          }

          if (damageLevels.indexOf(dLevel) === -1) {
            damageLevels.push(dLevel)
          }

          if (!(dLevel in damageLevelMarkers)) {
            damageLevelMarkers[dLevel] = []
          }

          damageLevelMarkers[dLevel].push(marker)

        })

        damageLevels.sort((a, b) => a - b)

        let buildingsLegendsElem = this.$el.querySelector('.buildings-legends')

        let addLegends = legendsElem => {

          let levels = [].concat(destroyedLevels, damageLevels).filter((v, i, a) => a.indexOf(v) === i)
          let buildingsLegends = ''

          levels.sort((a, b) => a - b)

          levels.forEach(dLevel => {
            buildingsLegends +=
              `<div class="buildings-legend">
                <span style="background: ${buildingColor(dLevel)}"></span>
                <span>d-${dLevel}</span>
              </div>`
          })

          legendsElem.innerHTML = buildingsLegends
        }

        if (buildingsLegendsElem)
        {
          addLegends(buildingsLegendsElem)
        }
        else
        {
          const legend = window.L.control({ position: 'bottomright' })

          legend.onAdd = map => {
            let legendsElem = window.L.DomUtil.create('div', 'map-legend buildings-legends')
            addLegends(legendsElem)
            return legendsElem
          }

          legend.addTo(this.map.object)
        }

        const map = this.map.object
        const controls = map._controls
        let addedOverlays = {}

        let updateMarkerCluster = () => {

          if (this.map.markers) {
            map.removeLayer(this.map.markers)
          }

          let markerCluster = createMapMarkerClusterGroup()
          let addLayer = marker => { markerCluster.addLayer(marker) }

          damageLevels.forEach(dLevel => {
            if(addedOverlays[dLevel]) {
              damageLevelMarkers[dLevel].forEach(addLayer)
            }
          })

          if(addedOverlays['destroyed']) {
            destroyedMarkers.forEach(addLayer)
          }

          this.map.markers = markerCluster
          map.addLayer(markerCluster)

        }

        let addOverlay = (key, label) => {

          const makerksGroup = new window.L.LayerGroup([])

          controls.addOverlay(makerksGroup, label)
          map.addLayer(makerksGroup)

          addedOverlays[key] = true
          updateMarkerCluster()

          makerksGroup.on('add', () => {
            addedOverlays[key] = true
            updateMarkerCluster()
          })

          makerksGroup.on('remove', () => {
            addedOverlays[key] = false
            updateMarkerCluster()
          })

        }

        damageLevels.forEach(dLevel => {
          addOverlay(dLevel, `Прогноз повреждений d-${dLevel}`)
        })

        if (destroyedMarkers.length > 0) {
          addOverlay('destroyed', 'Ранее повреждённые объекты')
        }

        mapCentering(map, coordinates)
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

      this.$root.$on('onMapBuildingsDataFetched', buildings => { this.addData(buildings) })
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
  @import '~scss/event_map';
</style>

