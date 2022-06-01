<template>
  <div class="poll__container">
    <date-time-questions
      :key="`dt-${refreshKey}`"
      :timezone="timezone"
      @update="requestData.eventData.eventDateTime = $event"
    />
    <earthquake-questions
      :questions="questions"
      :key="`eq-${refreshKey}`"
      @update="updateAnswers"
    />
    <b-button variant="primary" @click="submit">Отправить</b-button>
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
      localisations: [],
      questions: [],
      actions: {},
      refreshKey: null,
      requestData: {
        eventData: {
          type: 'eventDateTime',
          eventDateTime: null
        },
        location: {
          lat: null,
          lon: null
        },
        feltReport: {
          pollId: null,
          answers: []
        }
      }
    }
  },
  watch: {
    location: {
      deep: true,
      handler: function(value) {
        this.requestData.location = value
      }
    }
  },
  methods: {
    submit: function() {
      const formData = this.requestData
      if (this.validate(formData)) {
        this.$http.post(apiSettings.endpointFeltReport, formData)
          .then(response => {
            console.debug(response)
          }).catch(error => {
            this.errorResponse = error.response
          })
      } else {
        // @todo: alert error
        console.error('Please fill out all the mandatory fields')
      }
    },
    validate: function(data) {
      return !!data.eventData.eventDateTime && !!data.location.lat && !!data.location.lon && !!data.feltReport.pollId
    },
    updateAnswers: function(data) {
      this.requestData.feltReport.answers = []
      const questionIds = Object.keys(data)
      questionIds.forEach(questionId => {
        this.requestData.feltReport.answers.push({
          questionId: 1 * questionId,
          answerId: 1 * data[questionId]
        })
      })
    },
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
      this.requestData.feltReport.pollId = pollData.id
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
