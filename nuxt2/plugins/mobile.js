export default (context, inject) => {
  if (window) {
    const onMobile = screen.width < 768
    inject('onMobile', onMobile)
  }
}
