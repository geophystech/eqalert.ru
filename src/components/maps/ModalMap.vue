<template>
  <div class="modal-map">
    <b-btn size="sm" v-b-modal.map-dialog>Показать на карте</b-btn>
    <b-modal
      id="map-dialog"
      size="lg"
      v-bind:title="title"
      :hide-footer="true"
      :no-close-on-backdrop="true"
      :lazy="true"
      @shown="onOpen"
      @hide="onClose">
      <div class="map" :id="map.id"/>
    </b-modal>
  </div>
</template>

<script>
  import {createMap} from '@/map_functions'
  import {agency, eventColor, eventRadius} from '@/helpers/event'

  export default {
    name: 'ModalMap',
    props: {
      filtersData: {}
    },
    data() {
      return {
        title: '',
        map: {
          coordinates: [58.651, 142.395],
          id: 'modal-map',
          object: null
        }
      }
    },
    methods: {
      onOpen: function(e)
      {
        let map = this.map.object = createMap(this.map.id, this.map.coordinates, {
          showStations: false,
          zoom: 4
        })

        let coordinates = []
        map.spin(true)

        this.getAllEvents((events) => {

          events.forEach(event => {

            const datetime = this.$moment(event.locValues.data.event_datetime)
            const datetimeHumanreadable = datetime.format('LL в HH:mm:ss UTC')
            const datetimeDiff = this.$moment.utc().diff(datetime, 'hours')
            const magnitude = event.locValues.data.mag.toFixed(1)
            const magnitudeType = event.locValues.data.mag_t
            const longitude = event.locValues.data.lon
            const latitude = event.locValues.data.lat
            const depth = event.locValues.data.depth
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

            coordinates.push([latitude, longitude])

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
            marker.addTo(map)

          })

          let bound = map._getBoundsCenterZoom(window.L.latLngBounds(coordinates))

          map._zoomHome.setHomeCoordinates(bound.center)
          map._zoomHome.setHomeZoom(bound.zoom)
          map.setView(bound.center, bound.zoom)

          map.spin(false)

          let startDate = this.$moment(events[events.length - 1].locValues.data.event_datetime).format('L')
          let endDate = this.$moment(events[0].locValues.data.event_datetime).format('L')

          this.title = `Загружено ${events.length} событий (${startDate} — ${endDate})`

        })
      },
      onClose: function(e)
      {
        if (this.previousRequest) {
          this.previousRequest.abort()
        }

        this.map.object.remove()
      },

      getAllEvents: function(callBack)
      {
        let events = []
        let params = Object.assign(Object.assign({}, this.filtersData), {
          include: 'nearestCity',
          limit: 1000,
          cursor: ''
        })

        let _getEvents = function()
        {
          this.$http.get(this.$root.$options.settings.api.endpointEvents, {
            params: params,
            before: (request) => {
              if (this.previousRequest) {
                this.previousRequest.abort()
              }

              this.previousRequest = request
            }
          })
            .then(response => {
              events = events.concat(response.data.data)
              params.cursor = response.data.meta.cursor.next
              params.cursor ? _getEvents() : callBack(events)
            })
            .catch(error => {
              this.map.object.spin(false)
              console.log(error)
            })

        }.bind(this)

        _getEvents()
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';
</style>

<style lang="scss" scoped>

  @import '~scss/global';
  @import '~scss/mixins/_calc';

  .modal-map
  {
    display: inline-block;

    /deep/ .modal
    {
      padding-left: 15px;
      height: 100%;

      .modal-dialog
      {
        @include calc(height, '100% - 57px', 100%);
        max-width: none;

        .modal-content
        {
          height: 100%;

          .modal-header
          {
            padding: 0.6rem 1rem;

            .modal-title {
              text-align: center;
              font-size: 1rem;
              width: 100%;
            }
          }

          .modal-body
          {
            padding: 2px;
            height: 1%;

            .map {
              height: 100%;
            }
          }
        }
      }
    }
  }

</style>
