<template>
  <div class="static-page">
    <vue-markdown :source="content" />
  </div>
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
        about: 'О сервисе',
        stations: 'Сеть станций'
      }
    }
  },
  metaInfo() {
    return {
      title: this.pages[this.page]
    }
  },
  methods: {
    getContent: function(page = this.page) {
      this.$http.get(`/static/markdown/${this.page}.md`)
        .then(response => {
          this.content = response.data
        })
        .catch(error => {
          console.log(error)
        })
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

<style lang="scss">
  @import '../assets/scss/global.scss';

  h1, h2, h3, h4, h5, h6 {
    text-align: center !important;
  }

  img {
    display: block;
    margin: 0 auto;
    max-width: 100%;
  }

  .static-page {
    margin-top: 3%;
  }
</style>
