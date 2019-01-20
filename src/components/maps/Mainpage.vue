<template>
  <div class="map" :id="map.id"/>
</template>

<script>
  import {createMap, createMapEventMarker} from '@/map_functions'
  import {EVENTS_RANGES} from '@/helpers/event'

  export default {
    data() {
      return {
        map: {
          defaultEventsRange: 'lastWeekEvents',
          coordinates: [58.651, 142.395],
          id: 'map-mainpage',
          object: null
        }
      }
    },

    methods: {

      createMap: function()
      {
        let map = this.map.object = createMap(this.map.id, this.map.coordinates, {
          addToggleShowObjects: this.$store.getters.user.authenticated,
          showStations: false,
          zoom: 4
        })

        const defaultEventsRange = this.map.defaultEventsRange
        let apiSettings = this.$root.$options.settings.api
        let $moment = this.$moment
        let $http = this.$http

        let legend = window.L.control({position: 'bottomright'})
        let stateLabel = window.L.DomUtil.create('p')
        let markers = []

        let addEvents = function(events)
        {
          markers.forEach(marker => map.removeLayer(marker))
          markers = []

          events.reverse().forEach(event => {
            let marker = createMapEventMarker(event, $moment)
            markers.push(marker)
            marker.addTo(map)
          })
        }

        legend.onAdd = function()
        {
          /** @type HTMLElement */
          let btnGroup = window.L.DomUtil.create('div', 'btn-group btn-group-toggle map-legend map-legend-mainpage')

          let appendBtn = function(eventsRangeName, callBack)
          {
            /** @type HTMLElement */
            let btn = window.L.DomUtil.create('label', 'btn btn-sm btn-default')
            let eventsRange = EVENTS_RANGES[eventsRangeName]
            let checked = (eventsRangeName === defaultEventsRange)
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

          Object.keys(EVENTS_RANGES).forEach(eventsRangeName => {

            let eventsRange = EVENTS_RANGES[eventsRangeName]
            let minDateSubtract = eventsRange.minDateSubtract

            appendBtn(eventsRangeName, () => {

              let minDate = $moment.utc().subtract(minDateSubtract[0], minDateSubtract[1])

              $http.get(apiSettings.endpointEventsLight, {
                params: {
                  datetime_min: minDate.format('YYYY-MM-DD HH:mm:ss'),
                  limit: eventsRange.limit || 1000
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

        legend.addTo(map)

        let text = window.L.control({position: 'bottomright'})

        text.onAdd = function() {
          let div = window.L.DomUtil.create('div', 'map-text')
          div.appendChild(stateLabel)
          return div
        }

        text.addTo(map)
      }
    },

    mounted() {
      this.createMap()
    }
  }
</script>

<style lang="scss">
  @import '~scss/event_map';

  .map {
    .map-legend-mainpage {
      padding: 0 !important;
    }
  }
</style>
