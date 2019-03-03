<template>

  <div class="last-events">

    <b-card header="Последние события" header-class="text-center">

      <b-row v-for="event in events" :key="event.id" no-gutters align-v="center"
             :class="{ event: true, 'highlight-event': highlightEvent(event.id) }">

        <router-link :to="routerLink(event.id)" class="d-flex align-items-center" :key="event.id">

          <b-col cols="2" class="magnitude text-center">
            <strong>{{ event.locValues.data.mag.toFixed(1) }}</strong>
          </b-col>

          <b-col cols="10" class="event-data">
            <div class="settlement">{{ event.settlement }}</div>
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
  import apiSettings from '@/settings/api'
  import { round } from '@/helpers/math'

  export default {
    props: ['event'],
    data() {
      return {
        events: []
      }
    },
    methods: {
      routerLink: function(eventId)
      {
        let query = {}

        if (this.$route.query.backUrlQuery) {
          query.backUrlQuery = this.$route.query.backUrlQuery
        }

        return {
          name: 'Event',
          params: {
            id: eventId
          },
          query
        }
      },
      fetchEvents: function()
      {
        this.$http.get(apiSettings.endpointEvents, {
          params: {
            datetime_min: this.$moment.utc().subtract(6, 'months').format('YYYY-MM-DD 00:00:00'),
            has_training: !this.event || !this.event.has_training ? 0 : 1,
            limit: this.$root.onMobile ? 20 : 10,
            include: 'nearestCity'
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
          .catch(error => {
            console.log(error.response)
          })
      },
      highlightEvent: function(id) {
        if (this.event) return id === this.event.id

        return false
      }
    },
    created() {
      this.fetchEvents()
    }
  }
</script>

<style lang="scss" scoped>

  @import '~scss/_variables';

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

      .col-2 {
        padding-left: 1%;
        padding-right: 0;
      }

      .col-10 {
        padding-left: 1%;
        padding-right: 5%;
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
