
<script>
export default {
  name: 'Spinner',
  extends: (process.client) ? import('vue-simple-spinner') : null,
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
