export default {
  computed: {
    onMobile() {
      return process.browser && screen.width < 768
    }
  }
}
