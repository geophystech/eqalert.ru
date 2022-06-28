<template>
  <div class="earthquake-questions__container">
    <div v-for="question in questions" :key="`question-${question.id}`">
      <div>
        <b-form-group>
          <template slot="label">
            {{ question.text[localisation] }} <span style="color: red" title="Обязательный вопрос">*</span>
          </template>
          <b-form-radio
            v-for="answer in question.answers.data"
            :key="`answer-${answer.id}`"
            v-model="answers[`${question.id}`]"
            :name="`question-${question.id}`"
            :value="answer.id"
          >{{ answer.text[localisation] }}</b-form-radio>
        </b-form-group>
      </div>
      <hr/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EarthquakeQuestions',
  props: {
    questions: {
      type: Array,
      default: []
    },
    localisation: {
      type: String,
      default: 'ru'
    }
  },
  data() {
    return {
      answers: {}
    }
  },
  watch: {
    answers: {
      deep: true,
      handler: function(value) {
        this.$emit('update', value)
      }
    }
  }
}
</script>

<style lang="scss">
.earthquake-questions__container {
  .form-group {
    legend {
      font-size: 1.25rem;
      font-weight: 700;
    }
    .custom-radio {
      label {
        font-size: 1.075rem;
      }
    }
  }
}
</style>
