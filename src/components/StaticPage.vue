<template>
  <vue-markdown :source="content" class="static-page-content" />
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'static-page',
  components: { VueMarkdown },
  data() {
    return {
      content: '',
      page: this.$router.currentRoute.params.page,
      pages: {
        about: 'О проекте'
      }
    }
  },
  metaInfo() {
    return {
      title: this.pages[this.page]
    }
  },
  methods: {
    getContent: function() {
      this.$http.get(`/static/markdown/${this.page}.md`)
        .then(response => { this.content = response.data })
    }
  },
  created() {
    this.getContent()
  },
  beforeRouteUpdate(to, from, next) {
    this.page = to.params.page
    this.getContent()
    next()
  }
}
</script>

<style lang="scss" scoped>
  @import '~scss/_variables';

  div /deep/ {
    margin-top: 3%;

    h1, h2, h3, h4, h5, h6 {
      text-align: center !important;
    }

    img {
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }
</style>
