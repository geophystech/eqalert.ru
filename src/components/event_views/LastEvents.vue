<template>
  <div class="last-events">
    <b-card header="Последние события"
            header-class="text-center">

      <b-row no-gutters class="event" align-v="center" v-for="event in lastEvents" :key="event.hashid">
        <router-link :to="{ name: 'Event', params: { hashid: event.hashid }}" class="d-flex align-items-center">
          <b-col cols="2" class="magnitude text-center"><strong>{{ event.locValues.data.mag }}</strong></b-col>
          <b-col>
            <div class="settlement">{{ event.settlement }}</div>
            <div class="datetime">
              {{ moment.utc(event.locValues.data.event_datetime).locale('ru').format('LL в HH:mm:ss UTC') }}, глубина {{ event.locValues.data.depth }} км
            </div>
          </b-col>
        </router-link>
      </b-row>
    </b-card>
  </div>
</template>

<script>
const moment = require('moment')
require('moment/locale/ru')

export default {
  props: ['lastEvents'],
  computed: {
    moment: function() {
      return moment
    }
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

      .magnitude {
        color: $color-orange;
        font-size: 120%;
        padding-left: 4%;
        padding-right: 0;
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
  }
</style>
