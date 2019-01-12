<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import {
    addEpicenter, buildingColor, createMap, id, removeEpicenter,
    setView, createMapMarkerPopupBuilding
  } from '@/map_functions.js'

  import { colorDarken, colorLighten, colorHexToRGB } from '@/helpers/color'

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
        let damageLevels = []

        buildings.forEach(building => {

          let dLevel = building.damage_level

          if (dLevel < 1) return

          if (damageLevels.indexOf(dLevel) === -1) {
            damageLevels.push(dLevel)
          }

          const {lat: latitude, lon: longitude} = building.building.data
          const coordinates = new window.L.LatLng(latitude, longitude)
          const markerColor = buildingColor(dLevel)
          let markerOpts = {
            fillColor: markerColor,
            damageLevel: dLevel,
            dropShadow: true,
            gradient: true,
            innerRadius: 0
          }
          let marker

          if (building.building.data.is_primary)
          {
            marker = new window.L.RegularPolygonMarker(coordinates, Object.assign(markerOpts, {
              color: colorDarken(markerColor, 10),
              numberOfSides: 4,
              fillOpacity: 0.7,
              radius: 15,
              weight: 1
            }))
          }
          else
          {
            marker = new window.L.MapMarker(coordinates, Object.assign(markerOpts, {
              radius: 7
            }))
          }

          let popup = createMapMarkerPopupBuilding(building.building.data, {
            pgaValue: building.pga_value,
            damageLevel: dLevel
          })

          marker.bindPopup(popup)

          if (!(dLevel in damageLevelMarkers)) {
            damageLevelMarkers[dLevel] = []
          }

          damageLevelMarkers[dLevel].push(marker)

        })

        damageLevels.sort((a, b) => a - b)

        if (!this.$el.querySelector('.map-legend'))
        {
          const legend = window.L.control({ position: 'bottomright' })

          legend.onAdd = map => {

            let div = window.L.DomUtil.create('div', 'map-legend buildings-legends')
            let buildingsLegends = ''

            damageLevels.forEach(dLevel => {
              buildingsLegends +=
                `<div class="buildings-legend">
                  <span style="background: ${buildingColor(dLevel)}"></span>
                  <span>d-${dLevel}</span>
                </div>`
            })

            div.innerHTML = buildingsLegends
            return div
          }

          legend.addTo(this.map.object)
        }

        const _map = this.map.object
        const controls = _map._controls
        let addedOverlays = {}
        let updateMarkerCluster = function()
        {
          if (this.map.markers) {
            _map.removeLayer(this.map.markers)
          }

          let markerCluster = new window.L.MarkerClusterGroup({
            disableClusteringAtZoom: 15,
            iconCreateFunction: function(cluster)
            {
              let _damageLevels = []

              cluster.getAllChildMarkers().forEach(marker => {
                let damageLevel = marker.options.damageLevel
                if (damageLevel && _damageLevels.indexOf(damageLevel) === -1) {
                  _damageLevels.push(damageLevel)
                }
              })

              _damageLevels = _damageLevels.sort((a, b) => b - a)
              let _color = buildingColor(_damageLevels[0])

              return new window.L.DivIcon({
                className: `marker-cluster marker-cluster-damage-level`,
                html:
                  `<div style="background: ${colorHexToRGB(colorLighten(_color, 25), 0.6)}">
                  <div style="background: ${colorHexToRGB(_color, 0.6)}">
                      <span>${cluster.getChildCount()}</span>
                  </div>
                </div>`,
                iconSize: new window.L.Point(40, 40)
              })
            }
          })

          damageLevels.forEach(dLevel => {
            if(addedOverlays[dLevel]) {
              damageLevelMarkers[dLevel].forEach(marker => {
                markerCluster.addLayer(marker)
              })
            }
          })

          this.map.markers = markerCluster
          _map.addLayer(markerCluster)

        }.bind(this)

        damageLevels.forEach(dLevel => {

          const makerksGroup = new window.L.LayerGroup([])

          controls.addOverlay(makerksGroup, `Прогноз повреждений d-${dLevel}`)
          _map.addLayer(makerksGroup)

          addedOverlays[dLevel] = true
          updateMarkerCluster()

          makerksGroup.on('add', () => {
            addedOverlays[dLevel] = true
            updateMarkerCluster()
          })

          makerksGroup.on('remove', () => {
            addedOverlays[dLevel] = false
            updateMarkerCluster()
          })

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

