export default {
  async asyncData({ $axios, route }) {
    let { data, status } = await $axios.get(`/markdown/${route.params.page}.md`)
    if (status === 200)
    {
      const pages = {
        about: 'О проекте'
      }
      const page = pages[route.params.page] ? pages[route.params.page] : '';
      return { content: data, htmlTitle: page }
    }
    else
    {
      return { content: '', htmlTitle: '' }
    }
  }
}
