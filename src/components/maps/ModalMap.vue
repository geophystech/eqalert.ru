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
  import {createMap, createMapEventMarker, mapCentering} from '@/map_functions'
  import apiSettings from '@/settings/app'

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
          gestureHandling: false,
          showStations: false,
          zoom: 4
        })

        let $moment = this.$moment

        map.scrollWheelZoom.enable()
        map.spin(true)

        this.getAllEvents((events) => {

          let startDate = $moment(events[events.length - 1].event_datetime).format('L')
          let endDate = $moment(events[0].event_datetime).format('L')
          let coordinates = []

          this.title = `Загружено ${events.length} событий (${startDate} — ${endDate})`

          events.forEach(event => {
            createMapEventMarker(event, $moment).addTo(map)
            coordinates.push([event.lat, event.lon])
          })

          mapCentering(map, coordinates)
          map.spin(false)

        })
      },
      onClose: function(e)
      {
        if (this.previousRequest) {
          this.previousRequest.abort()
        }

        this.map.object.remove()
        this.title = ''
      },

      getAllEvents: function(callBack)
      {
        let events = []
        let params = Object.assign(Object.assign({}, this.filtersData), {
          include: 'nearestCity',
          limit: 1000,
          cursor: ''
        })

        let _getEvents = function(url)
        {
          this.$http.get(url, {
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
              let pagination = response.data.meta.pagination
              let nextPageUrl = pagination.links.next
              this.title = `Загружено ${events.length} из ${pagination.total} событий`
              nextPageUrl ? _getEvents(nextPageUrl) : callBack(events)
            })
            .catch(error => {
              this.map.object.spin(false)
              console.log(error)
            })

        }.bind(this)

        _getEvents(apiSettings.endpointEventsLight)
      }
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';
</style>

<style lang="scss" scoped>

  @import '~scss/_variables';
  @import '~scss/_mixins';

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
