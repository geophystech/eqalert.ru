<template>
  <div class="map" :id="map.id"/>
</template>

<script>
  import {createMap} from '@/map_functions'
  import {agency} from '@/helpers/event'

  export default {
    data() {
      return {
        map: {
          coordinates: [58.651, 142.395],
          id: 'map-mainpage',
          object: null,
          defaultEventsRange: 'lastWeekEvents',
          eventsRanges: {
            lastDayEvents: {
              title: 'События за последние сутки',
              minDateSubtract: [1, 'days'],
              label: '< 24 ч',
              color: '#FF0000',
              limit: 500
            },
            lastWeekEvents: {
              title: 'События за последнюю неделю',
              minDateSubtract: [1, 'weeks'],
              label: '1-7 дн',
              color: '#FFA500',
              limit: 500
            },
            last2WeekEvents: {
              title: 'События за последние две недели',
              minDateSubtract: [2, 'weeks'],
              label: '7-14 дн',
              color: '#FFFF00',
              limit: 500
            },
            past3MonthsEvents: {
              title: 'События за последние 3 месяца',
              minDateSubtract: [3, 'months'],
              label: '> 14 дн',
              color: '#808080',
              limit: 500
            }
          }
        }
      }
    },

    methods: {
      createMap: function() {
        this.map.object = createMap(this.map.id, this.map.coordinates, 4, false)
        let apiSettings = this.$root.$options.settings.api
        let selfComponent = this
        let $moment = this.$moment
        let $http = this.$http
        let _map = this.map

        let legend = window.L.control({position: 'bottomright'})
        let stateLabel = window.L.DomUtil.create('p')
        let markers = []

        let addEvents = function(events) {
          markers.forEach(marker => _map.object.removeLayer(marker))
          markers = []

          events.reverse().forEach(event => {

            const datetime = $moment(event.locValues.data.event_datetime)
            const datetimeDiff = $moment.utc().diff(datetime, 'hours')
            const datetimeHumanreadable = datetime.format('LL в HH:mm:ss UTC')
            const depth = event.locValues.data.depth
            const latitude = event.locValues.data.lat
            const longitude = event.locValues.data.lon
            const magnitude = event.locValues.data.mag.toFixed(1)
            const magnitudeType = event.locValues.data.mag_t
            const options = {
              fillColor: selfComponent.eventColor(datetimeDiff),
              radius: selfComponent.eventRadius(magnitude),
              numberOfSides: 360,
              colorOpacity: 1.0,
              fillOpacity: 0.8,
              gradient: false,
              color: 'black',
              weight: 1
            }

            const marker = new window.L.RegularPolygonMarker(new window.L.LatLng(latitude, longitude), options)
            const message =
              `<table class="table table-hover table-sm table-responsive">
              <tbody>
                <tr>
                  <th class="align-middle" scope="row">Магнитуда</th>
                  <td><span class="magnitude-color">${magnitude}</span> ( M<sub>${magnitudeType}</sub> )</td>
                </tr>
                <tr>
                  <th scope="row">Время</th>
                  <td>${datetimeHumanreadable}</td>
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
            <div class="text-center read-more"><a href="#/events/${event.id}" class="btn btn-success">Подробнее</a></div>`

            marker.bindPopup(message)
            marker.addTo(_map.object)
            markers.push(marker)
          })
        }

        legend.onAdd = function() {
          /** @type HTMLElement */
          let btnGroup = window.L.DomUtil.create('div', 'btn-group btn-group-toggle map-legend map-legend-mainpage')

          let appendBtn = function(eventsRangeName, callBack) {
            /** @type HTMLElement */
            let btn = window.L.DomUtil.create('label', 'btn btn-sm btn-default')
            let eventsRange = _map.eventsRanges[eventsRangeName]
            let checked = (eventsRangeName === _map.defaultEventsRange)
            let changeHandler = function() {
              stateLabel.innerText = eventsRange.title
              callBack()
            }

            btn.innerHTML =
              `<input type="radio" name="__map_report__" ${checked ? 'checked' : ''} />
               <span>${eventsRange.label}</span>`

            /** @type HTMLInputElement */
            let radio = btn.querySelector('input[type=radio]')

            radio.addEventListener('change', changeHandler, false)
            if (checked) changeHandler()

            radio.setAttribute('data-range', eventsRangeName)
            btn.style.backgroundColor = eventsRange.color
            btn.setAttribute('title', eventsRange.title)

            btnGroup.appendChild(btn)
          }

          Object.keys(_map.eventsRanges).forEach(eventsRangeName => {

            let eventsRange = _map.eventsRanges[eventsRangeName]
            let minDateSubtract = eventsRange.minDateSubtract

            appendBtn(eventsRangeName, () => {

              let minDate = $moment.utc().subtract(minDateSubtract[0], minDateSubtract[1])

              $http.get(apiSettings.endpointEvents, {
                params: {
                  datetime_min: minDate.format('YYYY-MM-DD HH:mm:ss'),
                  limit: eventsRange.limit || 500
                }
              })
                .then(response => {
                  addEvents(response.data.data)
                })
                .catch(error => {
                  console.log(error)
                })
            })

          })

          let checkedBtn = btnGroup.querySelector('input[type=radio]:checked')

          if (!checkedBtn) {
            checkedBtn = btnGroup.querySelector('input[type=radio]:first-child')
            checkedBtn.checked = true
            checkedBtn.dispatchEvent(new Event('change'))
          }

          return btnGroup
        }

        legend.addTo(this.map.object)

        let text = window.L.control({position: 'bottomright'})

        text.onAdd = function() {
          let div = window.L.DomUtil.create('div', 'map-text')
          div.appendChild(stateLabel)
          return div
        }

        text.addTo(this.map.object)
      },

      eventColor: function(timeDifference) {
        if (timeDifference <= 24) {
          return this.map.eventsRanges.lastDayEvents.color
        } else if (timeDifference > 24 && timeDifference <= 168) {
          return this.map.eventsRanges.lastWeekEvents.color
        } else if (timeDifference > 168 && timeDifference <= 336) {
          return this.map.eventsRanges.last2WeekEvents.color
        } else {
          return this.map.eventsRanges.past3MonthsEvents.color
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
      }
    },

    mounted() {
      this.createMap()
    }
  }
</script>

<style lang="scss">
  @import '../../assets/scss/event_map';

  .map {
    .map-legend-mainpage {
      padding: 0 !important;
    }
  }
</style>
