
<script>
  import VueSpinner from 'vue-simple-spinner'
  export default {
    name: 'Spinner',
    extends: VueSpinner,
    props: {
      'line-fg-color': {
        type: String,
        default: '#337ab7'
      },
      'line-size': {
        type: Number,
        default: 1
      },
      'size': {
        default: 26
      }
    }
  }
</script>

<style scoped>

</style>
