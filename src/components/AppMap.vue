<template>
  <div class="map" :id="mapId" />
</template>

<script>
import { convertMsk64 } from '@/helpers.js'

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
    'buildings',
    'hashid',
    'mapId',
    'shouldDrawEpicenter',
    'shouldDrawLastEvents',
    'shouldDrawLDOs',
    'shouldDrawMsk64',
    'shouldDrawPga',
    'target'
  ],
  data() {
    return {
      buildingsInformation: {},
      center: [50.351, 142.395],
      events: [],
      initializedMaps: [],
      ldos: [],
      maxZoom: 18,
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
    buildingColor: function(damageLevel) {
      switch (damageLevel) {
        case 0: return 'cyan'
        case 1: return '#008000'
        case 2: return '#ffa500'
        case 3: return '#ff0000'
      }
    },
    drawBuildings: function() {
      let markers = new L.MarkerClusterGroup({ disableClusteringAtZoom: 15 })

      this.buildings.forEach(building => {
        if (building.damage_level < 1) return

        const marker = new L.MapMarker(new L.LatLng(building.building.data.lat, building.building.data.lon), {
          dropShadow: true,
          fillColor: this.buildingColor(building.damage_level),
          gradient: true,
          innerRadius: 0,
          radius: 7
        })

        const message =
          `<table class="table table-hover table-sm table-responsive">
            <tbody>
              <tr>
                <th class="align-middle" scope="row">Тип строения</th>
                <td>${building.building.data.building_type}</td>
              </tr>
              <tr>
                <th scope="row">Тип фундамента</th>
                <td>${building.building.data.building_base_type}</td>
              </tr>
              <tr>
                <th scope="row">Материал</th>
                <td>${building.building.data.fabric_type}</td>
              </tr>
              <tr>
                <th scope="row">Год постройки</th>
                <td>${building.building.data.built_year}</td>
              </tr>
              <tr>
                <th scope="row">Кол-во этажей</th>
                <td>${building.building.data.flats}</td>
              </tr>
              <tr>
                <th scope="row">Адрес</th>
                <td>${building.building.data.street}, д. ${building.building.data.street_number}</td>
              </tr>
              <tr>
                <th scope="row">Кол-во проживающих</th>
                <td>${building.building.data.residents}</td>
              </tr>
              <tr>
                <th scope="row">Максимальная бальность</th>
                <td>${building.building.data.max_msk64} (MSK64)</td>
              </tr>
              <tr>
                <th scope="row">Прогноз повреждений</th>
                <td>d-${building.damage_level}</td>
              </tr>
              <tr>
                <th scope="row">PGA</th>
                <td>${building.pga_value || 0.0}</td>
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
      legend.onAdd = map => {
        let div = L.DomUtil.create('div', 'map-legend')
        div.innerHTML =
          `<div class="buildings-legend"><span style="background: ${this.buildingColor(1)}"></span><span>d-1</span></div>
           <div class="buildings-legend"><span style="background: ${this.buildingColor(2)}"></span><span>d-2</span></div>
           <div class="buildings-legend"><span style="background: ${this.buildingColor(3)}"></span><span>d-3</span></div>
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
    drawLDOs: function() {
      this.ldos.forEach(ldo => {
        ldo.parts.forEach(part => {
          const coordinates = [[part.latitude_start, part.longitude_start], [part.latitude_end, part.longitude_end]]
          const partPolyline = L.polyline(coordinates, { color: part.color }).addTo(window.map[this.hashid][this.target])
          let message =
            `<table class="table table-hover table-sm table-responsive">
              <thead>
                <tr>
                  <th class="text-center" colspan=2>Общая информация</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th class="align-middle" scope="row">Наименование</th>
                  <td>${ldo.name}</td>
                </tr>
                <tr>
                  <th scope="row">Количество анализируемых участков</th>
                  <td>${ldo.parts_number}</td>
                </tr>
                <tr>
                  <th scope="row">Год постройки</th>
                  <td>${part.built_year}</td>
                </tr>
                <tr>
                  <th scope="row">Глубина залегания</th>
                  <td>${part.height}</td>
                </tr>
                <tr>
                  <th scope="row">Материал конструкций</th>
                  <td>${part.fabric_type}</td>
                </tr>
                <tr>
                  <th scope="row">Тип грунта</th>
                  <td>${part.soil_type}</td>
                </tr>

                <tr>
                  <th class="text-center" colspan=2>Информация о сейсмических воздействиях</th>
                </tr>`

          if (part.has_damage === true) {
            message +=
              `<tr>
                <th scope="row">PGA</th>
                <td>${part.pga_value}</td>
              </tr>
              <tr>
                <th scope="row">Вероятность повреждения</th>
                <td>${part.damage}</td>
              </tr>`
          } else {
            message +=
              `<tr>
                <td class="text-center" colspan=2>сейсмическое воздействие не оказано</t>
               </tr>`
          }

          message +=
            `   <tr>
                  <th scope="row">Примечания</th>
                  <td>${part.notes}</td>
                </tr>
              </tbody>
            </table>`

          partPolyline.bindPopup(message)

          let partColor = null

          partPolyline.on('mouseover', function(event) {
            partColor = this.options.color

            partPolyline.setStyle({ color: 'cyan' })
          })

          partPolyline.on('mouseout', function(event) {
            partPolyline.setStyle({ color: partColor })
          })
        })
      })

      if (this.shouldDrawEpicenter) this.drawEpicenter()
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
    drawMsk64: function(data) {
      let legendData = ''

      data.forEach(item => {
        const value = convertMsk64(item.value)
        const color = this.msk64Color(value)

        const circle = L.circle(
          [this.center[0], this.center[1]],
          item.distance * 1000,
          { color: color, fillColor: color })

        circle.addTo(window.map[this.hashid][this.target])
        circle.bindPopup(`<div class="text-center"><strong>${value}</strong></div>`)

        legendData += `<i style="background: ${color}"></i>${value}<br>`
      })

      if (data.length) {
        const legend = L.control({ position: 'bottomright' })

        legend.onAdd = function() {
          const div = L.DomUtil.create('div', 'map-legend')
          div.innerHTML = legendData

          return div
        }

        legend.addTo(window.map[this.hashid][this.target])
      }

      if (this.shouldDrawEpicenter) this.drawEpicenter()
    },
    drawPga: function() {
      let legendData = ''

      Object.keys(this.pga).forEach((key) => {
        const lineColor = this.pgaLineColor(this.pga[key].range)
        const pga = L.polygon(this.pga[key].data, { color: lineColor, weigh: 2 })

        pga.addTo(window.map[this.hashid][this.target])
        pga.bindPopup(`Пиковое ускорение грунта: ${this.pga[key].range}%g (ускорение свободного падения)`)

        legendData += `<i style="background: ${lineColor}"></i>${this.pga[key].range}<br>`
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
        let marker = new L.RegularPolygonMarker(new L.LatLng(station.sta_lat, station.sta_lon), {
          numberOfSides: 3,
          rotation: 30.0,
          radius: 7,
          fillOpacity: 1.0,
          color: false,
          fillColor: this.$root.$options.settings.stations.colors[station.scnl_network]
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
                <td>${station.channel_num}</td>
              </tr>
              <tr>
                <th scope="row">Высота</th>
                <td>${station.sta_elevation}</td>
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
    getLastEvents: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/123a377666c3fb31c3892cc3dfa3229d/raw/0b88f16059653b841ddb944b57e2ff5c65cba163/eq_last_events.json')
        .then(response => {
          this.events = response.data.events
          this.drawLastEvents()
        })
        .catch(error => { console.log(error) })
    },
    getLDOs: function() {
      this.$http.get('https://gist.githubusercontent.com/blackst0ne/d11aa34f71ae59da19f0a59379f0c0cd/raw/0949a047792fc84a346aa420848e0761d8609a59/eq_QgpAn7OW_ldos.json')
        .then(response => {
          this.ldos = response.data.ldos
          this.drawLDOs()
        })
        .catch(error => { console.log(error) })
    },
    getMsk64: function() {
      this.$http.get(this.$root.$options.settings.api.endpointEventMsk64(this.hashid))
        .then(response => {
          this.drawMsk64(response.data.data)
        })
        .catch(error => { console.log(error) })
    },
    getPga: function() {
      this.$http.get(this.$root.$options.settings.api.endpointEventPga(this.hashid))
        .then(response => {
          this.pga = response.data.data
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
      this.$http.get(this.$root.$options.settings.api.endpointStations)
        .then(response => {
          this.stations = response.data.data
          this.drawStations()
        })
        .catch(error => { console.log(error) })
    },
    msk64Color: function(value) {
      switch (value) {
        case 'I': return '#ffffff'
        case 'I-II': return '#ffffff'
        case 'II': return '#bfccff'
        case 'II-III': return '#bfccff'
        case 'III': return '#9999ff'
        case 'III-IV': return '#9999ff'
        case 'IV': return '#80ffff'
        case 'IV-V': return '#80ffff'
        case 'V': return '#7df894'
        case 'V-VI': return '#7df894'
        case 'VI': return '#ffff00'
        case 'VI-VII': return '#ffff00'
        case 'VII': return '#ffc800'
        case 'VII-VIII': return '#ffc800'
        case 'VIII': return '#ff9100'
        case 'VIII-IX': return '#ff9100'
        case 'IX': return '#ff0000'
        case 'IX-X': return '#ff0000'
        case 'X': return '#c80000'
        case 'X-XI': return '#c80000'
        case 'XI': return '#800000'
        case 'XI-XII': return '#800000'
        case 'XII': return '#400000'
      }
    },
    pgaLineColor: function(range) {
      switch (range) {
        case '<=0.15': return '#fff5f0'
        case '0.15-0.3': return '#fee0d2'
        case '0.3-2.8': return '#fcbba1'
        case '2.8-6.2': return '#fc9272'
        case '6.2-12': return '#fb6a4a'
        case '12-22': return '#ef3b2c'
        case '22-40': return '#cb181d'
        case '40-75': return '#a50f15'
        case '75-139': return '#67000d'
        case '>139': return '#400000'
      }
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
    } else if (this.buildings) {
      this.drawBuildings()
    } else if (this.shouldDrawLDOs) {
      this.getLDOs()
    } else if (!this.shouldDrawLastEvents) {
      this.drawEpicenter()
    }
  }
}
</script>

<style lang="scss">
  .map {
    height: 450px;

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

