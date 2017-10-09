<template>
  <div id="map" />
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

const L = window.L
const geophystechLink = '<a href="https://geophystech.ru">GEOPHYSTECH LLC</a>'
let map = null
let boundaries = null
let controlLayers = null

export default {
  name: 'app-map',
  components: {},
  props: ['shouldDrawEpicenter', 'shouldDrawLastEvents'],
  data() {
    return {
      center: [50.17689812200105, 142.66845703125],
      events: [],
      maxZoom: 18,
      plateBoundaries: null,
      stations: null,
      tileProviders: {
        'OpenStreetMap': new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: `<a href="http://osm.org">OpenStreetMap</a> | ${geophystechLink}`
        }),
        'Google Roadmap': new L.GridLayer.GoogleMutant({ attribution: geophystechLink }, 'roadmap'),
        'Yandex Satellite': new L.Yandex('satellite', { attribution: geophystechLink }),
        'Yandex Hybrid': new L.Yandex('hybrid', { attribution: geophystechLink }),
        'Yandex Map': new L.Yandex('', { attribution: 'geophystechLink' })
      },
      zoom: 5
    }
  },
  methods: {
    drawEpicenter: function() {
      const epicenter = new L.StarMarker((new L.LatLng(this.center[0], this.center[1])), {
        color: '',
        fillColor: '#ff0a0a',
        fillOpacity: 1.0,
        numberOfPoints: 5,
        radius: 12,
        weight: 2
      })

      epicenter.bindPopup('Эпицентр землетрясения')
      map.addLayer(epicenter)
    },
    drawLastEvents: function() {
      this.events.reverse().forEach((event) => {
        let marker = new L.RegularPolygonMarker(new L.LatLng(event.latitude, event.longitude), {
          color: 'black',
          colorOpacity: 1.0,
          fillColor: this.eventColor(event.datetime_in_hours),
          fillOpacity: 0.8,
          gradient: false,
          numberOfSides: 360,
          radius: this.eventRadius(event.magnitude),
          weight: 1
        })

        let message =
          `<table class="table table-hover table-sm table-responsive">
            <thead>
              <tr>
                <th class="text-center" colspan=2>${event.hashid}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th class="align-middle" scope="row">Магнитуда</th>
                <td><span class="magnitude-color">${event.magnitude}</span> ( M<sub>${event.magnitude_type}</sub> )</td>
              </tr>
              <tr>
                <th scope="row">Время</th>
                <td>${moment.utc(event.datetime).locale('ru').format('LL в HH:mm:ss UTC')}</td>
              </tr>
              <tr>
                <th scope="row">Координаты</th>
                <td>${event.latitude}N, ${event.longitude}E</td>
              </tr>
              <tr>
                <th scope="row">Глубина</th>
                <td>${event.depth} км</td>
              </tr>
            </tbody>
          </table>
          <div class="text-center read-more"><a href="#/events/${event.hashid}" class="btn btn-success">Подробнее</a></div>`

        marker.bindPopup(message)
        marker.addTo(map)
      })

      let legend = L.control({ position: 'bottomright' })
      legend.onAdd = function() {
        let div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML += '<span style="background:#FF0000;">< 24 ч</span>'
        div.innerHTML += '<span style="background:#FFA500">1-5 дн</span>'
        div.innerHTML += '<span style="background:#FFFF00">6-14 дн</span>'
        div.innerHTML += '<span style="background:#808080">> 14 дн</span>'
        return div
      }
      legend.addTo(map)

      let text = L.control({ position: 'bottomright' })
      text.onAdd = function() {
        let div = L.DomUtil.create('div', 'map-text')
        div.innerHTML += '<p>События за последние 3 месяца</p>'
        return div
      }
      text.addTo(map)
    },
    drawMap: function() {
      map = L.map('map', {
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' },
        scrollWheelZoom: false,
        worldCopyJump: true,
        zoomAnimation: true,
        zoomControl: false
      }).setView(this.center, this.zoom)

      L.Control.zoomHome({ zoomHomeIcon: 'home' }).addTo(map)

      this.drawTileLayers()

      // Store current tile provider to the storage
      map.on('baselayerchange', event => { this.$store.dispatch('setCurrentTileProvider', event.name) })
    },
    drawPlateBoundaries: function() {
      boundaries = new L.GeoJSON(this.plateBoundaries, {
        style: {
          color: '#8A0707',
          weight: 2
        },
        onEachFeature: function(feature, layer) {
          const message =
            `Обновленная модель границ тектонических плит.
            <a href="http://onlinelibrary.wiley.com/doi/10.1029/2001GC000252/abstract">
            P.Bird, 2003</a>`

          layer.on('mouseover', function(event) { return this.bindPopup(message).openPopup(event.latlng) })

          return layer.on('mouseout', function(event) {
            const popups = document.getElementsByClassName('leaflet-popup')
            Array.from(popups).forEach((popup) => {
              popup.addEventListener('mouseleave', () => {
                return layer.closePopup()
              })
            })
          })
        }
      })

      controlLayers.addOverlay(boundaries, 'Plate Boundaries')
    },
    drawStations: function() {
      this.stations.forEach(function(station) {
        let marker = new L.RegularPolygonMarker(new L.LatLng(station.latitude, station.longitude), {
          numberOfSides: 3,
          rotation: 30.0,
          radius: 7,
          fillOpacity: 1.0,
          color: false,
          fillColor: station.color
        })

        let message =
          `<table class="table table-hover table-sm table-responsive">
            <thead>
              <tr>
                <th class="text-center" colspan=2>${station.scnl_name}.${station.scnl_network}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Каналов</th>
                <td>${station.channel_number}</td>
              </tr>
              <tr>
                <th scope="row">Высота</th>
                <td>${station.elevation}</td>
              </tr>
              <tr>
                <th scope="row">Тип датчика</th>
                <td>${station.instrument}</td>
              </tr>
              <tr>
                <th scope="row">Регистратор</th>
                <td>${station.datalogger}</td>
              </tr>
              <tr>
                <th scope="row">Частота дискр.</th>
                <td>${station.sample_rate}</td>
              </tr>
              <tr>
                <th scope="row">Телеметрия</th>
                <td>${station.has_realtime}</td>
              </tr>
              <tr>
                <th scope="row">Оператор</th>
                <td>${station.operator}</td>
              </tr>
            </tbody>
          </table>`

        marker.bindPopup(message)
        map.addLayer(marker)
      })
    },
    drawTileLayers: function() {
      // Draw stored tile provider for current user.
      this.tileProviders[this.$store.getters.currentTileProvider || Object.keys(this.tileProviders)[0]].addTo(map)
      controlLayers = new L.Control.Layers(this.tileProviders)
      controlLayers.addTo(map)
    },
    eventColor: function(timeDifference) {
      if (timeDifference <= 24) {
        return '#ff0000'
      } else if (timeDifference > 24 && timeDifference <= 120) {
        return '#ffa500'
      } else if (timeDifference > 120 && timeDifference <= 336) {
        return '#ffff00'
      } else {
        return '#808080'
      }
    },
    eventRadius: function(magnitude) {
      if (magnitude < 3.0) {
        return 4
      } else if (magnitude >= 3.0 && magnitude < 4.0) {
        return 6
      } else if (magnitude >= 4.0 && magnitude < 5.0) {
        return 8
      } else if (magnitude >= 5.0 && magnitude < 6.0) {
        return 12
      } else if (magnitude >= 6.0 && magnitude < 7.0) {
        return 16
      } else if (magnitude >= 7.0 && magnitude < 8.0) {
        return 21
      } else if (magnitude > 8) {
        return 26
      }
    },
    getLastEvents: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/123a377666c3fb31c3892cc3dfa3229d/raw/0b88f16059653b841ddb944b57e2ff5c65cba163/eq_last_events.json')
        .then(response => {
          this.events = response.data.events
          this.drawLastEvents()
        })
        .catch(error => { console.log(error) })
    },
    getPlateBoundaries: function() {
      this.$http.get('/static/json/plate_boundaries.geojson')
        .then(response => {
          this.plateBoundaries = response.data
          this.drawPlateBoundaries()
        })
        .catch(error => { console.log(error) })
    },
    getStations: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/123a377666c3fb31c3892cc3dfa3229d/raw/0b88f16059653b841ddb944b57e2ff5c65cba163/eq_last_events.json')
        .then(response => {
          this.stations = response.data.seismic_stations
          this.drawStations()
        })
        .catch(error => { console.log(error) })
    }
  },
  created() {
    if (this.shouldDrawLastEvents) {
      this.getStations()
      this.getLastEvents()
    }
    this.getPlateBoundaries()
  },
  mounted() {
    this.drawMap()
    if (this.shouldDrawEpicenter) this.drawEpicenter()
  }
}
</script>

<style lang="scss">
  #map {
    height: 450px;
    margin-top: 2%;

    .magnitude-color {
      color: red;
      font-size: 140%;
      font-weight: bold;
    }

    .read-more {
      a {
        color: white;
        padding: 3px 5px;
        font-size: 100%;
        line-height: 1.5;
      }
    }

    // Подпись.
    .map-text {
      background-color: rgba(255, 255, 255, .5);
      border-radius: 2px;
      bottom: -5px;
      font-size: 120%;

      p {
        color: #000;
        font-family: "Open Sans Light";
        max-height: 10px;
        padding-left: 27px;
        padding-right: 35px;
      }
    }

    .map-legend {
      color: #555;
      line-height: 15px;
      text-align: left;

      i {
        float: left;
        height: 15px;
        margin-right: 8px;
        opacity: .7;
        width: 15px;
      }

      span {
        display: inline-block;
        padding: 5px;
        text-align: center;
        width: 70px;
      }
    }

    /* ZoomHome plugin */
    .leaflet-control-zoomhome-home i.fa-home {
      font-size: 160%;
    }

    a.leaflet-control-zoomhome-in,
    a.leaflet-control-zoomhome-out {
      font-size: 150%;
    }
  }
</style>

