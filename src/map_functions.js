import axios from 'axios'
import store from './store'
import ApiSettings from './settings/api'
import StationsSettings from './settings/stations.js'

function listenerStoreCurrentTileProvider(map) {
  // Store current tile provider to the storage
  map.on('baselayerchange', tileProvider => {
    store.dispatch('setCurrentTileProvider', tileProvider.name)
  })
}

export function addEpicenter(map, coordinates)
{
  const options = {
    fillColor: '#ff0a0a',
    numberOfPoints: 5,
    fillOpacity: 1.0,
    radius: 12,
    weight: 2,
    color: ''
  }
  const latLng = new window.L.LatLng(coordinates[0], coordinates[1])
  const epicenter = new window.L.StarMarker(latLng, options)

  epicenter.bindPopup('Эпицентр землетрясения')
  map.addLayer(epicenter)

  return epicenter
}

export function addPlateBoundaries(controls) {
  const boundaries = new window.L.GeoJSON(store.getters.plateBoundaries, {
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

      layer.on('mouseout', function(event) {
        const popups = document.getElementsByClassName('leaflet-popup')

        Array.from(popups).forEach((popup) => {
          popup.addEventListener('mouseleave', () => {
            return layer.closePopup()
          })
        })
      })
    }
  })

  controls.addOverlay(boundaries, 'Plate Boundaries')
}

export function addStations(map, controls, show = true) {
  const settings = new ApiSettings()

  axios.get(settings.endpointStations)
    .then(response => {
      let markers = []

      response.data.data.forEach(station => {
        let marker = new window.L.RegularPolygonMarker(new window.L.LatLng(station.sta_lat, station.sta_lon), {
          numberOfSides: 3,
          rotation: 30.0,
          radius: 7,
          fillOpacity: 1.0,
          color: false,
          fillColor: StationsSettings.colors[station.scnl_network]
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
        markers.push(marker)
      })

      const makerksGroup = new window.L.LayerGroup(markers)

      if (show) map.addLayer(makerksGroup)
      controls.addOverlay(makerksGroup, 'Show seismic stations')
    })
    .catch(error => {
      console.log(error)
    })
}

export function buildingColor(damageLevel)
{
  if (damageLevel >= 3) {
    return '#ff0000'
  }

  switch (damageLevel) {
    case 0: return 'cyan'
    case 1: return '#008000'
    case 2: return '#ffa500'
  }
}

export function convertMsk64(value) {
  if (value >= -Infinity && value < 1.24) return 'I'
  if (value >= 1.25 && value < 1.75) return 'I-II'
  if (value >= 1.75 && value < 2.25) return 'II'
  if (value >= 2.25 && value < 2.75) return 'II-III'
  if (value >= 2.75 && value < 3.25) return 'III'
  if (value >= 3.25 && value < 3.75) return 'III-IV'
  if (value >= 3.75 && value < 4.25) return 'IV'
  if (value >= 4.25 && value < 4.75) return 'IV-V'
  if (value >= 4.75 && value < 5.25) return 'V'
  if (value >= 5.25 && value < 5.75) return 'V-VI'
  if (value >= 5.75 && value < 6.25) return 'VI'
  if (value >= 6.25 && value < 6.75) return 'VI-VII'
  if (value >= 6.75 && value < 7.25) return 'VII'
  if (value >= 7.25 && value < 7.75) return 'VII-VIII'
  if (value >= 7.75 && value < 8.25) return 'VIII'
  if (value >= 8.25 && value < 8.75) return 'VIII-IX'
  if (value >= 8.75 && value < 9.25) return 'IX'
  if (value >= 9.25 && value < 9.75) return 'IX-X'
  if (value >= 9.75 && value < 10.25) return 'X'
  if (value >= 10.25 && value < 10.75) return 'X-XI'
  if (value >= 10.75 && value < 11.25) return 'XI'
  if (value >= 11.25 && value < 11.74) return 'XI-XII'
  if (value >= 11.75 && value < Infinity) return 'XII'
}

function currentTileProvider() {
  // Get stored tile provider for the current user.
  const tileProvider = Object.keys(tileProviders())[0]

  return tileProviders()[tileProvider]
}

export function createMap(id, coordinates, {
  addToggleShowObjects = false,
  showStations = true,
  zoom = 8,
  store
} = {}) {
  const options = {
    fullscreenControl: true,
    fullscreenControlOptions: { position: 'topleft' },
    scrollWheelZoom: false,
    worldCopyJump: true,
    zoomAnimation: true,
    zoomControl: false
  }
  const map = window.L.map(id, options)
  setView(map, coordinates)
  currentTileProvider(store).addTo(map)
  listenerStoreCurrentTileProvider(map, store)

  const controls = new window.L.Control.Layers(tileProviders())
  let _zoomHome = zoomHome()

  _zoomHome.setHomeCoordinates(coordinates)
  _zoomHome.setHomeZoom(zoom)
  _zoomHome.addTo(map)

  // Plate Boundaries
  addPlateBoundaries(controls)
  // Show seismic stations
  addStations(map, controls, showStations)

  if(addToggleShowObjects)
  {

  }

  map.setZoom(zoom)
  controls.addTo(map)

  addFullscreenInvalidationFix(map)

  return map
}

export function id(id, tab) {
  return `map-${id}-${tab}`
}

export function msk64Color(value) {
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
}

export function removeEpicenter(map, epicenter) {
  if (!epicenter) return
  map.removeLayer(epicenter)
}

export function setView(map, coordinates, zoom = 5) {
  map.setView(coordinates, zoom)
}

export function createMapMarkerPopupBuilding(building)
{
  let buildingData = Object.assign({}, building.building.data)

  buildingData.address = `${buildingData.street}, д. ${buildingData.street_number}`
  buildingData.max_msk64 = `${buildingData.max_msk64} (MSK64)`
  buildingData.damage_level = `d-${building.damage_level}`
  buildingData.PGA = building.pga_value || 0.0

  let rows = [
    ['building_type', 'Тип строения'],
    ['building_base_type', 'Тип фундамента'],
    ['fabric_type', 'Материал'],
    ['built_year', 'Год постройки'],
    ['flats', 'Кол-во этажей'],
    ['address', 'Адрес'],
    ['residents', 'Кол-во проживающих'],
    ['max_msk64', 'Проектная бальность'],
    ['damage_level', 'Прогноз повреждений'],
    ['PGA', 'PGA'],
    ['notes', 'Доп. сведения'],
    ['data_source_reference', 'Источник данных']
  ]
    .filter(([prop] = []) => buildingData[prop].toString() !== '')
    .map(([prop, title] = []) => {
      return (
        `<tr class="row-building-${prop}">
          <th scope="row" class="align-middle">${title}</th><td>${buildingData[prop]}</td>
        </tr>`
      )
    })

  return (
    `<table class="table table-hover table-sm table-responsive">
      <tbody>
        ${rows.join('')}
        <tr>
          <th scope="row">По данным</th>
          <td><a href="http://www.fkr65.ru">www.fkr65.ru</a></td>
        </tr>
      </tbody>
    </table>`
  )
}

// There is a bug when layers got disappeared on exiting from fullscreen.
// See eqalert issue: https://github.com/geophystech/eqalert.ru/issues/249
// This is a workaround that explicitly redraws map to brig layers back.
// It should be removed once upstream libraries are fixed.
function addFullscreenInvalidationFix(map) {
  map.on('fullscreenchange', () => {
    if (!map.isFullscreen()) {
      map.invalidateSize()
    }
  })
}

function tileProviders() {
  const geophystechLink = '<a href="https://geophystech.ru">GEOPHYSTECH LLC</a>'

  return {
    'OpenStreetMap': new window.L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: `<a href="http://osm.org">OpenStreetMap</a> | ${geophystechLink}`
    })
  }
}

function zoomHome() {
  return window.L.Control.zoomHome({ zoomHomeIcon: 'home' })
}

