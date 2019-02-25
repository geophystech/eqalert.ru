import axios from 'axios'
import store from '@/store'
import apiSettings from '@/settings/api'
import stationsSettings from '@/settings/stations.js'

import {agency, eventColor, eventRadius} from '@/helpers/event'
import {colorDarken, colorHexToRGB, colorLighten} from '@/helpers/color'

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

export function addPlateBoundaries(controls)
{
  const boundaries = new window.L.GeoJSON(store.getters.plateBoundaries, {

    style: {
      color: '#8A0707',
      weight: 2
    },

    onEachFeature: function(feature, layer)
    {
      const message = `Обновленная модель границ тектонических плит.
        <a href="http://onlinelibrary.wiley.com/doi/10.1029/2001GC000252/abstract">
        P.Bird, 2003</a>`

      layer.on('mouseover', function(event) {
        return this.bindPopup(message).openPopup(event.latlng)
      })

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

export function addStations(map, controls, show = true)
{
  axios.get(apiSettings.endpointStations)
    .then(response => {
      let markers = []

      response.data.data.forEach(station => {

        let coordinates = new window.L.LatLng(station.sta_lat, station.sta_lon)
        let marker = new window.L.RegularPolygonMarker(coordinates, {
          fillColor: stationsSettings.colors[station.scnl_network],
          fillOpacity: 1.0,
          numberOfSides: 3,
          rotation: 30.0,
          color: false,
          radius: 7
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

      if (show) {
        map.addLayer(makerksGroup)
      }

      controls.addOverlay(makerksGroup, 'Show seismic stations')
    })
    .catch(error => {
      console.log(error)
    })
}

export const BUILDING_COLORS = [
  '#0000FF',
  '#008000',
  '#FFFF00',
  '#FFA500',
  '#FF0000',
  '#C50126'
]

export function buildingColor(damageLevel) {
  return BUILDING_COLORS[damageLevel > 5 ? 5 : damageLevel]
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

export function createMap(mapID, coordinates, {

  addToggleShowObjects = false,
  gestureHandling = true,
  showStations = true,
  zoom = 8,
  store

} = {}) {

  const options = {
    fullscreenControlOptions: { position: 'topleft' },
    gestureHandling: gestureHandling,
    fullscreenControl: true,
    worldCopyJump: true,
    zoomAnimation: true,
    zoomControl: false
  }

  const map = window.L.map(mapID, options)

  if(gestureHandling)
  {
    map.on('fullscreenchange', () => {
      if (map.isFullscreen()) {
        map.gestureHandling.removeHooks()
      } else {
        map.gestureHandling.addHooks()
      }
    })
  }

  setView(map, coordinates)
  listenerStoreCurrentTileProvider(map, store)

  let osm = new window.L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: `<a href="http://osm.org">OpenStreetMap</a> | <a href="https://geophystech.ru">GEOPHYSTECH LLC</a>`
  })

  let yndx = new window.L.Yandex(null, {
    ymapsOpts: { suppressMapOpenBlock: true }
  })

  map.addLayer(osm)

  const controls = new window.L.Control.Layers({
    'Open Street Map': osm,
    'Yandex Map': yndx
  })

  map._zoomHome = zoomHome()
  map._controls = controls

  map._zoomHome.setHomeCoordinates(coordinates)
  map._zoomHome.setHomeZoom(zoom)
  map._zoomHome.addTo(map)

  // Plate Boundaries
  addPlateBoundaries(controls)
  // Show seismic stations
  addStations(map, controls, showStations)

  if(addToggleShowObjects)
  {
    (function() {

      let markerClusterGroup = createMapMarkerClusterGroup()

      map.spin(true)

      let getBuildings = function(url)
      {
        axios.get(url, {params: { limit: 1000 }}).then(response => {

          response.data.data.forEach(building => {
            let marker = createMapBuildingMarker(building)
            markerClusterGroup.addLayer(marker)
          })

          let pagination = response.data.meta.pagination

          if (pagination.current_page < pagination.total_pages) {
            return getBuildings(pagination.links.next)
          }

          controls.addOverlay(markerClusterGroup, 'Show objects')
          map.spin(false)

        }).catch(error => {
          console.log(error)
          map.spin(false)
        })
      }

      getBuildings(apiSettings.endpointBuildings)

    })()
  }

  map.setZoom(zoom)
  controls.addTo(map)

  addFullscreenInvalidationFix(map)
  window.L.control.scale().addTo(map)

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

/**
 *
 * @return {window.L.MarkerClusterGroup}
 */
export function createMapMarkerClusterGroup()
{
  function _defaultIconCreateFunction(cluster)
  {
    let childCount = cluster.getChildCount()
    let markerSize = ''

    if (childCount < 10) {
      markerSize = 'small'
    } else if (childCount < 100) {
      markerSize = 'medium'
    } else {
      markerSize = 'large'
    }

    return new window.L.DivIcon({
      className: `marker-cluster marker-cluster-${markerSize}`,
      html: `<div><span>${childCount}</span></div>`,
      iconSize: new window.L.Point(40, 40)
    })
  }

  return new window.L.MarkerClusterGroup({
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

      if(!_damageLevels.length) {
        return _defaultIconCreateFunction(cluster)
      }

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
}

/**
 *
 * @param {{}} building
 * @param {number|null} damageLevel
 * @return {window.L.RegularPolygonMarker|window.L.MapMarker}
 */
export function createMapBuildingMarker(building, damageLevel = null)
{
  const coordinates = new window.L.LatLng(building.lat, building.lon)
  let _damageLevel = damageLevel

  if(damageLevel !== null && damageLevel < building.destroyed) {
    _damageLevel = building.destroyed
  }

  const markerColor = buildingColor(_damageLevel || building.destroyed)

  let markerOpts = {
    damageLevel: _damageLevel || building.destroyed,
    color: colorDarken(markerColor, 15),
    fillColor: markerColor,
    dropShadow: true,
    gradient: true,
    innerRadius: 0
  }
  let marker

  if (building.is_primary)
  {
    marker = new window.L.RegularPolygonMarker(coordinates, Object.assign(markerOpts, {
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

  let popup = createMapMarkerPopupBuilding(building, {
    pgaValue: building.pga_value,
    damageLevel: damageLevel
  })

  marker.bindPopup(popup)

  return marker
}

/**
 *
 * @param {{}} event
 * @param {moment} $moment
 * @return {window.L.RegularPolygonMarker}
 */
export function createMapEventMarker(event, $moment)
{
  const utcDatetime = $moment(event.event_datetime + ' +00:00', 'YYYY-MM-DD HH:mm:ss Z').utc()
  const datetimeDiff = $moment.utc().diff(utcDatetime, 'hours')
  const magnitude = event.mag.toFixed(1)
  const magnitudeType = event.mag_t
  const longitude = event.lon
  const latitude = event.lat
  const depth = event.depth
  const options = {
    fillColor: eventColor(datetimeDiff),
    radius: eventRadius(magnitude),
    numberOfSides: 360,
    colorOpacity: 1.0,
    fillOpacity: 0.8,
    gradient: false,
    color: 'black',
    weight: 1
  }

  const coordinates = new window.L.LatLng(latitude, longitude)

  const marker = new window.L.RegularPolygonMarker(coordinates, options)

  const popup =
    `<table class="table table-hover table-sm table-responsive">
       <tbody>
         <tr>
           <th class="align-middle" scope="row">Магнитуда</th>
           <td><span class="magnitude-color">${magnitude}</span> ( M<sub>${magnitudeType}</sub> )</td>
         </tr>
         <tr>
           <th scope="row">Время UTC</th>
           <td>${utcDatetime.format('LL в HH:mm:ss')}</td>
         </tr>
         <tr>
           <th scope="row">Локальное время</th>
           <td>${utcDatetime.local().format('LL в HH:mm:ss (UTCZ)')}</td>
         </tr>
         <tr>
           <th scope="row">Координаты</th>
           <td>${latitude}N, ${longitude}E</td>
         </tr>
         <tr>
           <th scope="row">Глубина</th>
           <td>${depth} км</td>
         </tr>
         <tr>
           <th scope="row">ID</th>
           <td>${event.id}</td>
         </tr>
         <tr>
           <th scope="row">Агентство</th>
           <td>${agency(event.agency)}</td>
         </tr>
       </tbody>
     </table>
     <div class="text-center read-more">
        <a href="#/events/${event.id}" class="btn btn-success">Подробнее</a>
     </div>`

  marker.bindPopup(popup)
  return marker
}

export function createMapMarkerPopupBuilding(building, {
  damageLevel = null,
  pgaValue = null
} = {})
{
  building = Object.assign({}, building)

  building.address = `${building.street}, д. ${building.street_number}`
  building.damage_level = damageLevel ? `d-${damageLevel}` : ''
  building.max_msk64 = `${building.max_msk64} (MSK64)`
  building.PGA = pgaValue ? (pgaValue || 0.0) : ''

  let destroyedLevel = building.destroyed
  building.destroyed = destroyedLevel ? `d-${destroyedLevel}` : ''

  let rows = [
    ['building_type', 'Тип строения'],
    ['building_base_type', 'Тип фундамента'],
    ['fabric_type', 'Материал'],
    ['built_year', 'Год постройки'],
    ['flats', 'Кол-во этажей'],
    ['address', 'Адрес'],
    ['residents', 'Кол-во человек на объекте'],
    ['max_msk64', 'Проектная сейсмостойкость'],
    ['damage_level', 'Прогноз повреждений'],
    ['destroyed', 'Повреждения от другого землетрясеним'],
    ['PGA', 'PGA'],
    ['notes', 'Доп. сведения'],
    ['data_source_reference', 'Источник данных']
  ]
    .filter(([prop] = []) => building[prop].toString() !== '')
    .map(([prop, title] = []) => {
      return (
        `<tr class="row-building-${prop}">
          <th scope="row" class="align-middle">${title}</th><td>${building[prop]}</td>
        </tr>`
      )
    })

  let caption = ''

  if(damageLevel === null) {
    caption = '<caption>Объект имеет повреждения от землетрясений</caption>'
  } else if (destroyedLevel && destroyedLevel > damageLevel) {
    caption = '<caption>Здание повреждено другим землетрясением</caption>'
  }

  return (
    `<table class="table table-hover table-sm table-responsive">
      ${caption}<tbody>${rows.join('')}</tbody>
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

function zoomHome() {
  return window.L.Control.zoomHome({ zoomHomeIcon: 'home' })
}

function isMarker(layer) {
  return layer instanceof window.L.MapMarker || layer instanceof window.L.RegularPolygonMarker
}

export function mapCentering(map, allCoordinates)
{
  /*
   * Автоматическое определение координат слишком жёстко центрирует почему-то.
   * Лучше передавать координаты явно в параметре allCoordinates.
   */

  if(!allCoordinates)
  {
    allCoordinates = []
    let addCoordinates = layer => {
      !isMarker(layer) || allCoordinates.push(layer.getLatLng())
    }

    map.eachLayer(layer => {
      if(layer instanceof window.L.MarkerClusterGroup) {
        layer.getLayers().forEach(addCoordinates)
      } else {
        addCoordinates(layer)
      }
    })
  }

  let bound = map._getBoundsCenterZoom(window.L.latLngBounds(allCoordinates))
  map._zoomHome.setHomeCoordinates(bound.center)
  map._zoomHome.setHomeZoom(bound.zoom)
  map.setView(bound.center, bound.zoom)
}
