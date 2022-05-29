<template>
  <div>

  </div>
</template>

<script>
export default {
  name: 'EarthquakeQuestions',
  props: {
    questions: {
      type: Array,
      default: []
    }
  },
  mounted() {
    console.log(this.questions)
  }
}
</script>

<style scoped>

</style>
