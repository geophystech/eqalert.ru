<template>
  <b-col class="last-events">
    <b-row class="d-flex justify-content-center header">
      <h4>
        <router-link :to="{ name: 'Events', query: { hasMt: 1 } }" key="events">Тензор момента</router-link>
      </h4>
    </b-row>
    <b-row class="event" align-v="center" v-for="event in events" :key="event.id">
      <router-link :to="{ name: 'Event', params: { id: event.id }}" class="d-flex align-items-center">
        <b-col cols="2" class="magnitude text-center">{{ event.locValues.data.mag }}</b-col>
        <b-col>
          <div class="settlement">
            {{ event.nearestCity.data.ep_dis }} км до {{ event.nearestCity.data.settlement.data.translation.data.title }}
          </div>
          <div class="datetime">
            {{ event.locValues.data.event_datetime | moment('LL в HH:mm:ss UTC') }}, глубина {{ event.depth }} км
          </div>
        </b-col>
        <b-col cols="2" class="moment-tensor text-center">
          <router-link :to="{ name: 'Event', params: { id: event.id, tab: 'moment-tensor' }}">
            <img :alt="event.id" :src="event.momentTensorImg.data.beachball.svg" class="img-responsive" />
          </router-link>
        </b-col>
      </router-link>
    </b-row>
  </b-col>
</template>

<script>
  export default {
    data() {
      return {
        events: []
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData: function() {
        this.$http.get(this.$root.$options.settings.api.endpointEvents, {
          params: {
            include: 'nearestCity,momentTensorImg',
            limit: 9,
            has_mt: 1
          }
        })
          .then(response => {
            this.events = this.events.concat(response.data.data)
          })
          .catch(error => { console.log(error) })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  $border: 1px $color-gray-light solid;

  .events-analytics-block {
    border-top: $border;
    height: auto;
    margin-top: 3%;

    h4 {
      a {
        color: $color-gray-dark;
      }
    }

    .header {
      padding-bottom: 3%;
      padding-top: 3%;
    }
  }
</style>
