<template>
  <div class="map" :id="mapId" />
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

const L = window.L
const geophystechLink = '<a href="https://geophystech.ru">GEOPHYSTECH LLC</a>'
let boundaries = null
let controlLayers = {}

export default {
  name: 'app-map',
  components: {},
  props: [
    'hashid',
    'mapId',
    'shouldDrawBuildings',
    'shouldDrawEpicenter',
    'shouldDrawLastEvents',
    'shouldDrawMsk64',
    'shouldDrawPga',
    'target'
  ],
  data() {
    return {
      buildings: [],
      buildingsInformation: {},
      center: [50.351, 142.395],
      events: [],
      initializedMaps: [],
      maxZoom: 18,
      msk64: [],
      pga: [],
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
    drawBuildings: function() {
      let markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 15 })

      this.buildings.forEach(building => {
        const marker = new L.MapMarker(new L.LatLng(building.latitude, building.longitude), {
          dropShadow: true,
          fillColor: building.color,
          gradient: true,
          innerRadius: 0,
          radius: 7
        })

        const message =
          `<table class="table table-hover table-sm table-responsive">
            <tbody>
              <tr>
                <th class="align-middle" scope="row">Тип строения</th>
                <td>${building.building_type}</td>
              </tr>
              <tr>
                <th scope="row">Тип фундамента</th>
                <td>${building.building_base_type}</td>
              </tr>
              <tr>
                <th scope="row">Материал</th>
                <td>${building.fabric_type}</td>
              </tr>
              <tr>
                <th scope="row">Год постройки</th>
                <td>${building.built_year}</td>
              </tr>
              <tr>
                <th scope="row">Кол-во этажей</th>
                <td>${building.flats}</td>
              </tr>
              <tr>
                <th scope="row">Адрес</th>
                <td>${building.street}, д. ${building.street_number}</td>
              </tr>
              <tr>
                <th scope="row">Кол-во проживающих</th>
                <td>${building.residents}</td>
              </tr>
              <tr>
                <th scope="row">Максимальная бальность</th>
                <td>${building.max_msk64} (MSK64)</td>
              </tr>
              <tr>
                <th scope="row">Прогноз повреждений</th>
                <td>d-${building.damage_level}</td>
              </tr>
              <tr>
                <th scope="row">PGA</th>
                <td>${building.pga}</td>
              </tr>
              <tr>
                <th scope="row">По данным</th>
                <td><a href="http://www.fkr65.ru">www.fkr65.ru</a></td>
              </tr>
            </tbody>
          </table>`

        marker.bindPopup(message)
        markers.addLayer(marker)
      })

      window.map[this.hashid][this.target].addLayer(markers)

      const legend = L.control({ position: 'bottomright' })
      legend.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML =
          `<div class="buildings-legend"><span style="background: #008000"></span><span>d-1</span></div>
           <div class="buildings-legend"><span style="background: #ffa500"></span><span>d-2</span></div>
           <div class="buildings-legend"><span style="background: #ff0000"></span><span>d-3</span></div>
          `
        return div
      }

      legend.addTo(window.map[this.hashid][this.target])

      if (this.shouldDrawEpicenter) this.drawEpicenter()
    },
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
      window.map[this.hashid][this.target].addLayer(epicenter)
    },
    drawLastEvents: function() {
      console.log(this.buildingsInformation)
      this.events.reverse().forEach((event) => {
        const marker = new L.RegularPolygonMarker(new L.LatLng(event.latitude, event.longitude), {
          color: 'black',
          colorOpacity: 1.0,
          fillColor: this.eventColor(event.datetime_in_hours),
          fillOpacity: 0.8,
          gradient: false,
          numberOfSides: 360,
          radius: this.eventRadius(event.magnitude),
          weight: 1
        })

        const message =
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
        marker.addTo(window.map[this.hashid][this.target])
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
      legend.addTo(window.map[this.hashid][this.target])

      let text = L.control({ position: 'bottomright' })
      text.onAdd = function() {
        let div = L.DomUtil.create('div', 'map-text')
        div.innerHTML += '<p>События за последние 3 месяца</p>'
        return div
      }
      text.addTo(window.map[this.hashid][this.target])
    },
    drawMap: function() {
      window.map[this.hashid][this.target] = L.map(this.mapId, {
        fullscreenControl: true,
        fullscreenControlOptions: { position: 'topleft' },
        scrollWheelZoom: false,
        worldCopyJump: true,
        zoomAnimation: true,
        zoomControl: false
      }).setView(this.center, this.zoom)

      L.Control.zoomHome({ zoomHomeIcon: 'home' }).addTo(window.map[this.hashid][this.target])

      this.drawTileLayers()

      // Store current tile provider to the storage
      window.map[this.hashid][this.target].on('baselayerchange', event => { this.$store.dispatch('setCurrentTileProvider', event.name) })
    },
    drawMsk64: function() {
      let legendData = ''

      this.msk64.forEach(msk => {
        const circle = L.circle(
          [this.center[0], this.center[1]],
          msk.distance * 1000,
          { color: msk.color, fillColor: msk.color })

        circle.addTo(window.map[this.hashid][this.target])
        circle.bindPopup(`<div class="text-center"><strong>${msk.value}</strong></div>`)

        legendData += `<i style="background: ${msk.color}"></i>${msk.value}<br>`
      })

      const legend = L.control({ position: 'bottomright' })
      legend.onAdd = function() {
        const div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML = legendData

        return div
      }

      legend.addTo(window.map[this.hashid][this.target])

      if (this.shouldDrawEpicenter) this.drawEpicenter()
    },
    drawPga: function() {
      let legendData = ''

      Object.keys(this.pga).forEach((key) => {
        const pga = L.polygon(this.pga[key].data, { color: this.pga[key].line_color, weigh: 2 })

        pga.addTo(window.map[this.hashid][this.target])
        pga.bindPopup(`Пиковое ускорение грунта: ${this.pga[key].range}%g (ускорение свободного падения)`)

        legendData += `<i style="background: ${this.pga[key].line_color}"></i>${this.pga[key].range}<br>`
      })

      let pgaLegend = L.control({ position: 'bottomright' })
      pgaLegend.onAdd = (map) => {
        const div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML += '<h6>%g</h6>'
        div.innerHTML += legendData

        return div
      }

      pgaLegend.addTo(window.map[this.hashid][this.target])

      if (this.shouldDrawEpicenter) this.drawEpicenter()
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

      controlLayers[this.hashid][this.target].addOverlay(boundaries, 'Plate Boundaries')
    },
    drawStations: function() {
      this.stations.forEach(station => {
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
        window.map[this.hashid][this.target].addLayer(marker)
      })
    },
    drawTileLayers: function() {
      // Draw stored tile provider for current user.
      this.tileProviders[this.$store.getters.currentTileProvider || Object.keys(this.tileProviders)[0]].addTo(window.map[this.hashid][this.target])

      controlLayers[this.hashid][this.target] = new L.Control.Layers(this.tileProviders)
      controlLayers[this.hashid][this.target].addTo(window.map[this.hashid][this.target])
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
    getBuildings: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/ec3b73cb31ece1eedc4c5a86f211e0a8/raw/2ab7e942c9eef6b1eab3b18d341def4573c821ed/eq_QgpAn7OW_buildings.json')
        .then(response => {
          this.buildings = response.data.buildings.filter(building => {
            // Show only damaged buildings.
            return building.damage_level > 0
          })
          this.drawBuildings()
        })
        .catch(error => { console.log(error) })
    },
    getLastEvents: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/123a377666c3fb31c3892cc3dfa3229d/raw/0b88f16059653b841ddb944b57e2ff5c65cba163/eq_last_events.json')
        .then(response => {
          this.events = response.data.events
          this.drawLastEvents()
        })
        .catch(error => { console.log(error) })
    },
    getMsk64: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/a255459e6af24ddba9d8abad2bbdf793/raw/c64daf2034c66ed85e024841721c480159cb2f3d/eq_QgpAn7OW_settlements.json')
        .then(response => {
          this.msk64 = response.data.msk64
          this.drawMsk64()
        })
        .catch(error => { console.log(error) })
    },
    getPga: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/e8b61b8885e4069a78854472c039360a/raw/b10ee6eb561dab972f2d520c3089ec50ac5b17e7/eq_QgpAn7OW_general_information.json')
        .then(response => {
          this.pga = response.data.event.pga
          this.drawPga()
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
    },
    populateControlLayers: function() {
      if (!controlLayers[this.hashid]) controlLayers[this.hashid] = {}
    }
  },
  created() {
    this.populateControlLayers()

    if (this.shouldDrawLastEvents) {
      this.getStations()
      this.getLastEvents()
    }
    this.getPlateBoundaries()
  },
  mounted() {
    this.drawMap()

    if (this.shouldDrawPga) {
      this.getPga()
    } else if (this.shouldDrawMsk64) {
      this.getMsk64()
    } else if (this.shouldDrawBuildings) {
      this.getBuildings()
    } else {
      this.drawEpicenter()
    }
  }
}
</script>

<style lang="scss">
  .map {
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
      background: rgba(255, 255, 255, .8);
      border-radius: 5px;
      box-shadow: 0 0 15px rgba(0, 0, 0, .2);
      color: #555;
      line-height: 15px;
      padding: 6px 8px;
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

      .buildings-legend {
        width: 50px;

        span:first-child {
          width: 10px;
        }

        span:last-child {
          margin-left: 10px;
          width: auto;
        }
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

