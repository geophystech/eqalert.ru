<template>
  <div class="map" :id="map.id"/>
</template>

<script>
  import {
    createMap, createMapEventMarker
  } from '@/config/map_functions'
  import {EVENTS_RANGES} from '@/helpers/event'

  export default
  {
    props: {
      gestureHandling: true,
      onlyStations: false
    },
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
        this.map.object = createMap(this.map.id, this.map.coordinates, {
          addToggleShowBuildings: this.$store.getters['user/user'].authenticated,
          addToggleShowLDOs: this.$store.getters['user/user'].authenticated,
          gestureHandling: this.gestureHandling,
          onlyStations: this.onlyStations,
          markerPopupHeader: '',
          showStations: false,
          zoom: 4,
          store: this.$store,
          axios: this.$axios,
          $api: this.$api,
        })

        if(!this.onlyStations) {
          this.addMapLegend()
        }
      },

      addMapLegend()
      {
        const map = this.map.object
        const defaultEventsRange = this.map.defaultEventsRange
        let $moment = this.$moment
        let $axios = this.$axios
        let $api = this.$api

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

        let _this = this

        legend.onAdd = function()
        {
          /** @type HTMLElement */
          let btnGroup = window.L.DomUtil.create('div', 'btn-group btn-group-toggle map-legend map-legend-mainpage')
          let getCheckedBtn = () => { return btnGroup.querySelector('input[type=radio]:checked') }
          let eventsRangeRequests = {}

          let disableBtns = function(disabled = true) {
            let btns = btnGroup.querySelectorAll('input[type=radio]')
            Array.prototype.forEach.call(btns, btn => { btn.disabled = disabled })
          }

          let setReloadTimer = (() => {

            let reloadTimeout = 300 // sec
            let reloadTimer

            return () => {

              if(reloadTimer) {
                clearTimeout(reloadTimer)
              }

              reloadTimer = setTimeout(() => {
                eventsRangeRequests[getCheckedBtn().dataset.rangeName]().then(() => {
                  _this.mapNotify('Данные о землетрясениях обновлены')
                })
              }, 1000 * reloadTimeout)

            }

          })()

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

            radio.setAttribute('data-range-name', eventsRangeName)
            btn.style.backgroundColor = eventsRange.color
            btn.setAttribute('title', eventsRange.title)

            btnGroup.appendChild(btn)
          }

          Object.keys(EVENTS_RANGES).forEach(eventsRangeName => {

            let eventsRange = EVENTS_RANGES[eventsRangeName]
            let minDateSubtract = eventsRange.minDateSubtract
            let request = function()
            {
              let minDate = $moment.utc().subtract(minDateSubtract[0], minDateSubtract[1])
              disableBtns()

              return $axios.get($api.endpointEventsLight, {
                params: {
                  datetime_min: minDate.format('YYYY-MM-DD HH:mm:ss'),
                  limit: eventsRange.limit || 1000
                }
              })
                .then(response => {
                  addEvents(response.data.data)
                  disableBtns(false)
                  setReloadTimer()
                })
            }

            eventsRangeRequests[eventsRangeName] = request
            appendBtn(eventsRangeName, () => {
              map.spin(true)
              request().then(() => {
                map.spin(false)
              })
            })

          })

          let checkedBtn = getCheckedBtn()

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
      },

      mapNotify: function(msg, delay = 3500)
      {
        let mapElem = document.getElementById(this.map.id)
        let mapPopup = document.createElement('div')
        let removeTimer

        mapPopup.setAttribute('class', 'map-notify')
        mapPopup.innerText = msg

        mapPopup.addEventListener('transitionend', e => {

          if(removeTimer) {
            clearTimeout(removeTimer)
          }

          removeTimer = setTimeout(() => {

            if(!mapPopup.classList.contains('show')) {
              mapElem.removeChild(mapPopup)
            }

          }, 100)

        }, false)

        mapElem.appendChild(mapPopup)

        setTimeout(() => {

          mapPopup.classList.add('show')

          setTimeout(() => {
            mapPopup.classList.remove('show')
          }, delay)

        }, 100)
      }
    },

    mounted() {
      this.createMap()
    }
  }
</script>

<style lang="scss">
  @import 'assets/scss/event_map';

  .map
  {
    .map-legend-mainpage {
      padding: 0 !important;
    }

    > .map-notify
    {
      box-shadow: 0 2px 10px 1px rgba(0,0,0,0.25);
      text-shadow: 0 -1px 0 rgba(0,0,0,0.2);
      transition: all 250ms ease-out;
      color: rgba(255,255,255,0.8);
      background-color: cadetblue;
      transform: translateX(-50%);
      border-radius: 3px;
      padding: 10px 20px;
      position: absolute;
      z-index: 9999999;
      font-size: 16px;
      opacity: 0;
      left: 50%;
      top: 0;

      &.show {
        transition: all 350ms ease-out;
        opacity: 1;
        top: 20px;
      }
    }
  }
</style>
