<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import {
    addEpicenter, buildingColor, createMap, id, removeEpicenter,
    setView, createMapMarkerPopupBuilding
  } from '@/map_functions.js'

  import { ColorTrasform } from '@/helpers.js'

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
            let damageLevel = damageLevels[0][0]

            if (damageLevel > 3) {
              damageLevel = 3
            }

            return new window.L.DivIcon({
              className: `marker-cluster marker-cluster-damage-level-${damageLevel}`,
              html: `<div><span>${cluster.getChildCount()}</span></div>`,
              iconSize: new window.L.Point(40, 40)
            })
          }
        })

        data.forEach(building => {
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
            marker = new window.L.StarMarker(coordinates, Object.assign(markerOpts, {
              color: ColorTrasform.darken(markerColor, 10),
              numberOfPoints: 8,
              fillOpacity: 0.7,
              innerRadius: 5,
              radius: 17,
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
               <div class="buildings-legend"><span style="background: ${buildingColor(3)}"></span><span>d≥3</span></div>`
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

  $level-colors: (
    1: #008000,
    2: #ffa500,
    3: #ff0000
  );

  @each $level, $color in $level-colors {
    .marker-cluster-damage-level-#{$level} {
      background-color: rgba(lighten($color, 20%), 0.6);
      > div { background-color: rgba($color, 0.6) }
    }
  }

</style>

