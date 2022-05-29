<template>
  <div>
    <div v-for="question in questions" :key="`question-${question.id}`">
      <b-form-group :label="question.text[localisation]">
        <b-form-radio
          v-for="answer in question.answers.data"
          :key="`answer-${answer.id}`"
          v-model="answers[`${question.id}`]"
          :name="`question-${question.id}`"
          :value="answer.id"
        >{{ answer.text[localisation] }}</b-form-radio>
      </b-form-group>
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
  mounted() {
    console.log(this.questions)
  }
}
</script>

<style scoped>

</style>
