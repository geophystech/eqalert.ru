<template>
  <div class="map" :id="map.id" />
</template>

<script>
  import { createMap } from '@/map_functions'
  import { agency } from '@/helpers/event'

  export default {
    data() {
      return {
        map: {
          coordinates: [50.351, 142.395],
          id: 'map-mainpage',
          object: null,
          events: []
        }
      }
    },
    methods: {
      addEvents: function(events) {
        events.reverse().forEach(event => {
          const datetime = this.$moment(event.locValues.data.event_datetime)
          const datetimeDiff = this.$moment.utc().diff(datetime, 'hours')
          const datetimeHumanreadable = datetime.format('LL в HH:mm:ss UTC')
          const depth = event.locValues.data.depth
          const latitude = event.locValues.data.lat
          const longitude = event.locValues.data.lon
          const magnitude = event.locValues.data.mag.toFixed(1)
          const magnitudeType = event.locValues.data.mag_t
          const options = {
            color: 'black',
            colorOpacity: 1.0,
            fillColor: this.eventColor(datetimeDiff),
            fillOpacity: 0.8,
            gradient: false,
            numberOfSides: 360,
            radius: this.eventRadius(magnitude),
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
          marker.addTo(this.map.object)
        })

        let legend = window.L.control({ position: 'bottomright' })

        legend.onAdd = function() {
          let div = window.L.DomUtil.create('div', 'map-legend map-legend-mainpage')
          div.innerHTML += '<span style="background:#FF0000;">< 24 ч</span>'
          div.innerHTML += '<span style="background:#FFA500">1-5 дн</span>'
          div.innerHTML += '<span style="background:#FFFF00">6-14 дн</span>'
          div.innerHTML += '<span style="background:#808080">> 14 дн</span>'

          return div
        }

        legend.addTo(this.map.object)

        let text = window.L.control({ position: 'bottomright' })

        text.onAdd = function() {
          let div = window.L.DomUtil.create('div', 'map-text')
          div.innerHTML += '<p>События за последние 3 месяца</p>'

          return div
        }
        text.addTo(this.map.object)
      },
      createMap: function() {
        this.map.object = createMap(this.map.id, this.map.coordinates, 5, false)
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
      fetchEvents: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEvents, {
          params: {
            limit: 500
          }
        })
          .then(response => { this.addEvents(response.data.data) })
          .catch(error => { console.log(error) })
      }
    },
    mounted() {
      this.createMap()
      this.fetchEvents()
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
