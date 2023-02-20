import htmlContent from '@/config/content/about'

export default {
  async asyncData() {
    const data = htmlContent
    const page = 'О проекте';
    return { content: data, htmlTitle: page }
  }
}
