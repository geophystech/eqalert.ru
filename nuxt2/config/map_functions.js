import stationsSettings from '@/settings/stations'

import {agency, eventColor, eventRadius} from '@/helpers/event'
import {colorDarken, colorHexToRGB, colorLighten} from '@/helpers/color'
import {numberDeclension} from '@/helpers/number'

function listenerStoreCurrentTileProvider(map, store) {
  // Store current tile provider to the storage
  map.on('baselayerchange', tileProvider => {
    store.dispatch('app/setCurrentTileProvider', tileProvider.name)
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

export const BUILDING_COLORS = [
  '#67C333',
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

  addToggleShowBuildings = false,
  addToggleShowLDOs = false,
  gestureHandling = true,
  showStations = true,
  onlyStations = false,
  zoom = 8,
  store,
  axios,
  $api,
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

  // remove Ukrainian flag
  map.attributionControl.setPrefix('')

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

  map.addLayer(yndx)

  const controls = new window.L.Control.Layers({
    'Yandex Map': yndx,
    'Open Street Map': osm
  })

  map._zoomHome = zoomHome()
  map._controls = controls

  map._zoomHome.setHomeCoordinates(coordinates)
  map._zoomHome.setHomeZoom(zoom)
  map._zoomHome.addTo(map)

  if(onlyStations)
  {
    addStations($api, axios, map).then(coordinates => {
      mapCentering(map, coordinates)
    })
  }
  else
  {
    // Plate Boundaries
    addPlateBoundaries(controls, store)

    // Show seismic stations
    addStations($api, axios, map, controls, showStations)

    // Show Buildings
    if(addToggleShowBuildings) {
      showBuildings($api, axios, map, controls)
    }

    // Show LDOs (long distance objects)
    if(addToggleShowLDOs) {
      showLDOs($api, axios, map, controls)
    }
  }

  map.setZoom(zoom)
  controls.addTo(map)

  addFullscreenInvalidationFix(map)
  window.L.control.scale().addTo(map)

  return map
}

// Plate Boundaries
function addPlateBoundaries(controls, store)
{
  const boundaries = new window.L.GeoJSON(store.getters['app/plateBoundaries'], {

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

  controls.addOverlay(boundaries, 'Границы плит')
}

// Show seismic stations
function addStations($api, axios, map, controls, show = true)
{
  const allCoords = []

  return new Promise((resolve, reject) => {

    axios.get($api.endpointStations)
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

          allCoords.push([station.sta_lat, station.sta_lon])

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

        if (!controls || show) {
          map.addLayer(makerksGroup)
        }

        if (controls) {
          controls.addOverlay(makerksGroup, 'Сейсмические станции')
        }

        resolve(allCoords)

      })

  })
}

// Show seismic stations
export function addFeltReports(map, items, controls, show = true)
{
  let markers = []

  const icon = window.L.icon({
    iconUrl: '/img/green-square.png',
    iconSize: [15, 15]
  })

  items.forEach((feltReportObject) => {
    const center = feltReportObject.location
    const cii = 1 * (feltReportObject.cii - 0.2).toFixed(2)
    const ciiText = `Интенсивность по ШСИ-2017: ${cii} ${numberDeclension(cii, ['балл', 'балла', 'баллов'])}`
    const countText = `Количество откликов: ${feltReportObject.count}`
    const {region, title} = feltReportObject.settlement.data.translation.data
    const locationText = `Населенный пункт: ${title}, ${region}`
    const popupText = `${locationText}<br/>${ciiText}<br/>${countText}`
    const marker = window.L
      .marker([center.lat, center.lon], {icon})
      .addTo(map)
      .bindPopup(popupText)
    markers.push(marker)
  })

  const markersGroup = new window.L.LayerGroup(markers)

  if (!controls || show) {
    map.addLayer(markersGroup)
  }

  if (controls) {
    controls.addOverlay(markersGroup, 'Отклики')
  }

  return markersGroup
}

// Show Buildings
function showBuildings($api, axios, map, controls)
{
  let _getBuildings = (function() {

    const httpConf = { params: { limit: 1000 } }
    let buildings = []

    return function(url)
    {
      return new Promise((resolve, reject) => {

        axios.get(url, httpConf).then(response => {

          buildings = buildings.concat(response.data.data)
          const pagination = response.data.meta.pagination

          if (pagination.current_page < pagination.total_pages) {
            _getBuildings(pagination.links.next)
          } else {
            resolve(buildings)
          }

        })

      })
    }

  })()

  function getBuildings(markerClusterGroup)
  {
    map.spin(true)

    _getBuildings($api.endpointBuildings).then(buildings => {

      buildings.forEach(building => {
        let marker = createMapBuildingMarker(building)
        markerClusterGroup.addLayer(marker)
      })

      map.spin(false)

    })
  }

  const markerClusterGroup = createMapMarkerClusterGroup()
  controls.addOverlay(markerClusterGroup, 'Здания и сооружения')
  let downloaded = false

  markerClusterGroup.on('add', () => {
    if(!downloaded) {
      downloaded = true
      getBuildings(markerClusterGroup)
    }
  })

}

// Show LDOs (long distance objects)
function showLDOs($api, axios, map, controls)
{
  async function getLDOs(layerGroup)
  {
    map.spin(true)

    const LDOs = (await axios.get($api.endpointLDOs)).data.data

    LDOs.forEach(async ldo => {
      ldo.parts = (await axios.get($api.endpointLdoParts(ldo.id))).data
      mapLDOsLayerCreate(ldo, layerGroup)
    })

    map.spin(false)
  }

  const layer = new window.L.LayerGroup([])
  controls.addOverlay(layer, 'Линейные объекты')
  let downloaded = false

  layer.on('add', () => {
    if(!downloaded) {
      downloaded = true
      getLDOs(layer)
    }
  })
}

export function mapLDOsLayerCreate(ldo, layer)
{
  ldo.parts.data.forEach(part => {

    const coordinates = [[part.lat_first, part.lon_first], [part.lat_end, part.lon_end]]

    let damageLevel = part.damage && part.damage.data.damage_level > part.destroyed
      ? part.damage.data.damage_level
      : part.destroyed

    const partPolyline = window.L.polyline(coordinates, {
      color: ldoPartColor(damageLevel)
    })

    partPolyline.addTo(layer)

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
         <th scope="row">Год постройки</th>
         <td>${part.built_year}</td>
       </tr>
       <tr>
         <th scope="row">Глубина залегания</th>
         <td>${part.height}</td>
       </tr>
       <tr>
         <th scope="row">Проектная сейсмостойкость</th>
         <td>${part.max_msk64} (MSK64)</td>
       </tr>
       <tr>
         <th scope="row">Материал конструкций</th>
         <td>${part.fabric_type}</td>
       </tr>
       <tr>
         <th scope="row">Тип грунта</th>
         <td>${ldoSoilType(part.soil_type)}</td>
       </tr>
       <tr>
         <th class="text-center" colspan=2>Информация о сейсмических воздействиях</th>
       </tr>
      `

    if (part.damage && part.damage.data.has_damage) {
      message +=
        `<tr>
          <th scope="row">PGA</th>
          <td>${part.damage.data.pga_value}</td>
        </tr>
        <tr>
          <th scope="row">Вероятность повреждения</th>
          <td>${damageLevel}</td>
        </tr>`
    } else {
      message += `<tr><td class="text-center" colspan=2>сейсмическое воздействие не оказано</t></tr>`
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
}

export function id(id, tab) {
  return `map-${id}-${tab}`
}

export function ldoPartColor(damageLevel)
{
  switch(damageLevel) {
    case(0): return 'green'
    case(1): return 'yellow'
    case(2): return 'orange'
    default: return 'red'
  }
}

export function ldoSoilType(type) {
  switch (type) {
    case 0: return 'не задан'
    case 1: return 'природные скальные грунты'
    case 2: return 'природные дисперсные грунты'
    case 3: return 'природные мерзлые грунты'
    case 4: return 'техногенные грунты'
  }
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
  return new window.L.MarkerClusterGroup({
    disableClusteringAtZoom: 15,
    iconCreateFunction: function(cluster)
    {
      let _color = buildingColor(0)
      let _damageLevels = []

      cluster.getAllChildMarkers().forEach(marker => {
        let damageLevel = marker.options.damageLevel
        if (damageLevel && _damageLevels.indexOf(damageLevel) === -1) {
          _damageLevels.push(damageLevel)
        }
      })

      if(_damageLevels.length) {
        _damageLevels = _damageLevels.sort((a, b) => b - a)
        _color = buildingColor(_damageLevels[0])
      }

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
  const marker = new window.L.CircleMarker(coordinates, options)

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
        <a href="/events/${event.id}" class="btn btn-success">Подробнее</a>
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
    ['destroyed', damageLevel === null ? 'Прогноз повреждений' : 'Повреждения от другого землетрясеним'],
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

  if(destroyedLevel)
  {
    if(damageLevel === null) {
      caption = 'Объект имеет повреждения от землетрясений'
    } else if (destroyedLevel > damageLevel) {
      caption = 'Здание повреждено другим землетрясением'
    }
  }

  if (caption) {
    caption = `<caption>${caption}</caption>`
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

export function mapCentering(map, coordinates)
{
  /*
   * Автоматическое определение координат слишком жёстко центрирует почему-то.
   * Лучше передавать координаты явно в параметре coordinates.
   */

  if(!coordinates)
  {
    coordinates = []
    let addCoordinates = layer => {
      !isMarker(layer) || coordinates.push(layer.getLatLng())
    }

    map.eachLayer(layer => {
      if(layer instanceof window.L.MarkerClusterGroup) {
        layer.getLayers().forEach(addCoordinates)
      } else {
        addCoordinates(layer)
      }
    })
  }

  let bound = map._getBoundsCenterZoom(window.L.latLngBounds(coordinates))
  map._zoomHome.setHomeCoordinates(bound.center)
  map._zoomHome.setHomeZoom(bound.zoom)
  map.setView(bound.center, bound.zoom)
}
