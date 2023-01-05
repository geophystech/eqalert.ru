<template>
  <div class="poll__container">
    <template v-if="submitted">
      <b-alert variant="success" show>
        Благодарим за уделенное Вами время! Форма была успешно отправлена.
      </b-alert>
    </template>
    <template v-else>
      <div class="poll__header">
        <p class="title">Ощутили землетрясение?</p>
        <p class="subtitle">Пожалуйста, ответьте на несколько важных вопросов.</p>
        <a class="text-primary" target="_blank" v-b-modal.why-modal>Зачем оставлять отклики?</a>

        <b-modal id="why-modal" ref="why-modal" modal-class="poll__error-modal" hide-footer hide-header hide-header-close>
          <p class="my-4 modal-body">
            С помощью опросных листов "Ощутили землетрясение?"
            мы получаем важную обратную связь от вас.
            Ответив на несколько вопросов анкеты, вы поможете
            уточнить интенсивность колебаний в области воздействия
            землетрясения. Это не займет много времени.
            Возможно именно ваш отклик окажется критически важным для
            объективного понимания силы сотрясений.
            Мы благодарим вас за предоставленные отклики.
          </p>
          <div class="actions">
            <b-button class="ml-auto mt-3 bg-primary" @click="$refs['why-modal'].hide()">Понятно</b-button>
          </div>
        </b-modal>

        <b-modal ref="error-modal" modal-class="poll__error-modal" hide-footer hide-header hide-header-close>
          <p class="modal-body">
            Что-то пошло не так... Пожалуйста, попробуйте ещё раз через некоторое время!
          </p>
          <div class="actions">
            <b-button class="ml-auto mt-3 bg-primary" @click="$refs['error-modal'].hide()">Закрыть</b-button>
          </div>
        </b-modal>
      </div>
      <hr/>
      <location-questions
        :key="`lq-${refreshKey}`"
        @update="updateLocation"
      />
      <date-time-questions
        v-if="requestData.eventData.type === 'eventDateTime'"
        :key="`dt-${refreshKey}`"
        :timezone="timezone"
        @update="requestData.eventData.eventDateTime = $event"
      />
      <earthquake-questions
        :questions="questions"
        :key="`eq-${refreshKey}`"
        @update="updateAnswers"
      />
      <b-button variant="primary" @click="submit" :disabled="!filled">Отправить</b-button>
    </template>
  </div>
</template>

<script>
import apiSettings from '@/settings/api'
import EarthquakeQuestions from './EarthquakeQuestions'
import timezone from './mixins/timezone'
import DateTimeQuestions from './DateTimeQuestions'
import LocationQuestions from './LocationQuestions'

export default {
  name: 'FeltReportPoll',
  components: {LocationQuestions, DateTimeQuestions, EarthquakeQuestions},
  mixins: [timezone],
  data() {
    return {
      location: {
        lat: null,
        lon: null
      },
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
      },
      submitted: false,
      filled: false
    }
  },
  watch: {
    requestData: {
      deep: true,
      handler: function(data) {
        this.filled = this.validate(data)
      }
    },
    '$route.query': {
      deep: true,
      handler: function() {
        this.$router.go(0)
      }
    },
    location: {
      deep: true,
      handler: function(value) {
        this.requestData.location = value
        this.getTimezone()
      }
    }
  },
  methods: {
    submit: function() {
      const formData = this.requestData
      if (this.validate(formData)) {
        this.$http.post(apiSettings.endpointFeltReport, formData)
          .then(response => {
            this.submitted = response.data.message
          }).catch(() => {
            this.showErrorModal()
          })
      } else {
        this.showErrorModal()
      }
    },
    showErrorModal: function() {
      this.$refs['error-modal'].show()
    },
    validate: function(data) {
      const eventDataValidated = data.eventData.type === 'eventDateTime' ?
        !!data.eventData.eventDateTime : !!data.eventData.reportId
      return eventDataValidated &&
        !!data.location.lat &&
        !!data.location.lon &&
        !!data.feltReport.pollId &&
        data.feltReport.answers.length === this.questions.length
    },
    updateLocation: function(location) {
      this.location = location
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
      if (this.$route.query.hasOwnProperty('reportId') && this.$route.query.reportId) {
        // @todo: add reportId validation (report exists or not)
        this.requestData.eventData = {
          type: 'reportId',
          reportId: this.$route.query.reportId
        }
      }
      this.errorResponse = null
      this.$http.get(apiSettings.endpointFeltReportPoll)
        .then(response => {
          this.setData(response.data.data)
        }).catch(() => {
          this.showErrorModal()
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
    this.refreshKey = Math.random() * Math.random()
  }
}
</script>

<style lang="scss">
.poll__container {
  margin-top: 3%;
  .poll__header {
    text-align: center;
    .title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
    }
    .subtitle {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .text-primary {
      font-weight: 600;
    }
  }
}
.poll__error-modal {
  .modal-body {
    font-size: 1.075rem;
  }
  .actions {
    display: flex;
  }
}
</style>
