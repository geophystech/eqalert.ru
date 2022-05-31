<template>
  <div class="poll__container">
    <date-time-questions :key="`dt-${refreshKey}`" :timezone="timezone"/>
    <earthquake-questions :questions="questions" :key="`eq-${refreshKey}`"/>
  </div>
</template>

<script>
import apiSettings from '@/settings/api'
import EarthquakeQuestions from './EarthquakeQuestions'
import geolocation from './mixins/geolocation'
import DateTimeQuestions from './DateTimeQuestions'

export default {
  name: 'FeltReportPoll',
  components: {DateTimeQuestions, EarthquakeQuestions},
  mixins: [geolocation],
  data() {
    return {
      pollId: null,
      localisations: [],
      questions: [],
      actions: {},
      refreshKey: null
    }
  },
  methods: {
    fetchData: function() {
      this.errorResponse = null
      this.$http.get(apiSettings.endpointFeltReportPoll)
        .then(response => {
          this.setData(response.data.data)
        }).catch(error => {
          this.errorResponse = error.response
        })
    },
    setData: function(data) {
      const pollData = data.poll.data
      this.pollId = pollData.id
      this.localisations = pollData.localisations.data
      this.questions = pollData.questions.data
      this.actions = data.actions.data
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.refreshKey = Math.random() * Math.random()
  }
}
</script>

<style lang="scss">
.poll__container {
  margin-top: 3%;
}
</style>
