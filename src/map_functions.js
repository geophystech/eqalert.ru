import store from './store'

function listenerStoreCurrentTileProvider(map) {
  // Store current tile provider to the storage
  map.on('baselayerchange', tileProvider => {
    store.dispatch('setCurrentTileProvider', tileProvider.name)
  })
}

export function addEpicenter(map, coordinates) {
  const options = {
    color: '',
    fillColor: '#ff0a0a',
    fillOpacity: 1.0,
    numberOfPoints: 5,
    radius: 12,
    weight: 2
  }
  const latLng = new window.L.LatLng(coordinates[0], coordinates[1])
  const epicenter = new window.L.StarMarker(latLng, options)

  epicenter.bindPopup('Эпицентр землетрясения')
  map.addLayer(epicenter)
}

export function buildingColor(damageLevel) {
  switch (damageLevel) {
    case 0: return 'cyan'
    case 1: return '#008000'
    case 2: return '#ffa500'
    case 3: return '#ff0000'
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
  const tileProvider = store.getters.currentTileProvider || Object.keys(tileProviders())[0]

  return tileProviders()[tileProvider]
}

export function createMap(id, coordinates, store) {
  const options = {
    fullscreenControl: true,
    fullscreenControlOptions: { position: 'topleft' },
    scrollWheelZoom: false,
    worldCopyJump: true,
    zoomAnimation: true,
    zoomControl: false
  }
  const map = window.L.map(id, options).setView(coordinates, 5)

  currentTileProvider(store).addTo(map)
  layersControl().addTo(map)
  zoomHome().addTo(map)
  listenerStoreCurrentTileProvider(map, store)

  return map
}

export function id(id, tab) {
  return `map-${id}-${tab}`
}

function layersControl() {
  return new window.L.Control.Layers(tileProviders())
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

function tileProviders() {
  const geophystechLink = '<a href="https://geophystech.ru">GEOPHYSTECH LLC</a>'

  return {
    'OpenStreetMap': new window.L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: `<a href="http://osm.org">OpenStreetMap</a> | ${geophystechLink}`
    }),
    'Google Roadmap': new window.L.GridLayer.GoogleMutant({ attribution: geophystechLink }, 'roadmap'),
    'Yandex Satellite': new window.L.Yandex('satellite', { attribution: geophystechLink }),
    'Yandex Hybrid': new window.L.Yandex('hybrid', { attribution: geophystechLink }),
    'Yandex Map': new window.L.Yandex('', { attribution: geophystechLink })
  }
}

function zoomHome() {
  return window.L.Control.zoomHome({ zoomHomeIcon: 'home' })
}

