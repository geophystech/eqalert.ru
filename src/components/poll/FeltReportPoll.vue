<template>
  <div class="poll__container">
    <earthquake-questions :questions="questions" :key="questions.length"/>
  </div>
</template>

<script>
import apiSettings from '@/settings/api'
import EarthquakeQuestions from './EarthquakeQuestions'
import geolocation from './mixins/geolocation'

export default {
  name: 'FeltReportPoll',
  components: {EarthquakeQuestions},
  mixins: [geolocation],
  data() {
    return {
      pollId: null,
      localisations: [],
      questions: [],
      actions: {}
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
  }
}
</script>

<style lang="scss">
.poll__container {
  margin-top: 3%;
}
</style>
