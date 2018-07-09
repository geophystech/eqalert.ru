<template>
  <div class="last-events">
    <b-card header="Последние события"
            header-class="text-center">

      <b-row no-gutters :class="{ event: true, 'highlight-event': highlightEvent(event.id) }" align-v="center" v-for="event in events" :key="event.id">
        <router-link :to="{ name: 'Event', params: { id: event.id } }" class="d-flex align-items-center" :key="event.id">
          <b-col cols="2" class="magnitude text-center">
            <strong>{{ event.locValues.data.mag }}</strong>
          </b-col>
          <b-col class="event-data">
            <div class="settlement">
              {{ event.settlement }}
            </div>
            <div class="datetime">
              {{ event.locValues.data.event_datetime | moment('LL в HH:mm:ss UTC') }},
              глубина {{ event.locValues.data.depth }} км
            </div>
          </b-col>
        </router-link>
      </b-row>
    </b-card>
  </div>
</template>

<script>
  import { round } from '@/helpers/math.js'

  export default {
    props: ['event'],
    data() {
      return {
        events: []
      }
    },
    methods: {
      fetchEvents: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEvents, {
          params: {
            limit: 10,
            show_nearest_city: 1
          }
        })
          .then(response => {
            response.data.data.forEach(event => {
              if (event.nearestCity) {
                const distance = round(event.nearestCity.data.ep_dis, 2)
                const title = event.nearestCity.data.settlement.data.translation.data.title
                event.settlement = `${distance} км до ${title}`
              } else {
                event.settlement = 'Населённый пункт: нет данных'
              }

              this.events.push(event)
            })
          })
          .catch(error => { console.log(error) })
      },
      highlightEvent: function(id) {
        return id === this.event.id
      }
    },
    created() {
      this.fetchEvents()
    }
  }
</script>

<style lang="scss" scoped>
  $color-blue: #337ab7;
  $color-gray-dark: #444;
  $color-gray-light: #dfdfdf;
  $color-gray-light-2: #999;
  $color-orange: #ff7300;
  $color-white-2: #faf9f9;
  $border: 1px $color-gray-light solid;

  .last-events {
    .event {
      &:not(:first-child) {
        border-top: $border;
      }

      padding-bottom: 4%;
      padding-top: 4%;

      &:hover {
        background-color: $color-white-2;
      }

      &:last-child {
        border-bottom: $border;
      }

      .event-data {
        padding-left: 0;
        padding-right: 0;
      }

      .magnitude {
        color: $color-orange;
        font-size: 115%;
      }

      .datetime {
        color: $color-gray-light-2;
        font-size: 70%;
      }

      a {
        color: $color-gray-dark;
        width: 100%;

        &:hover {
          text-decoration: none;
        }
      }
    }

    .card {
      .card-body {
        padding: 0;
      }

      .card-footer {
        a {
          border-bottom: 1px dotted $color-blue;
          font-size: 85%;
          font-weight: bold;
          text-decoration: none;
        }
      }
    }

    .highlight-event {
      background-color: #fcf1e6;
    }
  }
</style>
