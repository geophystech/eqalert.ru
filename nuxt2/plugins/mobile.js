export default (context, inject) => {
  if (process.browser) {
    const onMobile = screen.width < 768
    inject('onMobile', onMobile)
  }
}
