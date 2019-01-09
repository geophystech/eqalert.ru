<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import {
    addEpicenter, buildingColor, createMap, id, removeEpicenter,
    setView, createMapMarkerPopupBuilding, BUILDING_COLORS
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
        let markerCluster = new window.L.MarkerClusterGroup({
          disableClusteringAtZoom: 15,
          iconCreateFunction: function(cluster)
          {
            let damageLevels = {}

            cluster.getAllChildMarkers().forEach(marker => {
              let damageLevel = marker.options.damageLevel
              if (!damageLevel) return
              if (!(damageLevel in damageLevels)) {
                damageLevels[damageLevel] = 0
              }
              damageLevels[damageLevel]++
            })

            damageLevels = Object.entries(damageLevels).sort((a, b) => b[1] - a[1] || 1)
            let damageLevel = parseInt(damageLevels[0][0], 10)
            let _color = buildingColor(damageLevel)

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

        buildings.forEach(building => {

          if (building.damage_level < 1) return

          const {lat: latitude, lon: longitude} = building.building.data
          const coordinates = new window.L.LatLng(latitude, longitude)
          const markerColor = buildingColor(building.damage_level)
          let markerOpts = {
            damageLevel: building.damage_level,
            fillColor: markerColor,
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
            damageLevel: building.damage_level,
            pgaValue: building.pga_value
          })

          marker.bindPopup(popup)
          markerCluster.addLayer(marker)

        })

        this.map.markers = markerCluster
        this.map.object.addLayer(markerCluster)

        if (!this.$el.querySelector('.map-legend'))
        {
          const legend = window.L.control({ position: 'bottomright' })

          legend.onAdd = map => {

            let div = window.L.DomUtil.create('div', 'map-legend buildings-legends')
            let dLevelCount = BUILDING_COLORS.length - 1
            let buildingsLegends = ''

            for(let dLevel = 1; dLevel <= dLevelCount; dLevel++)
            {
              buildingsLegends +=
                `<div class="buildings-legend">
                  <span style="background: ${buildingColor(dLevel)}"></span>
                  <span>d${(dLevel === dLevelCount ? '≥' : '-')}${dLevel}</span>
                </div>`
            }

            div.innerHTML = buildingsLegends
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

