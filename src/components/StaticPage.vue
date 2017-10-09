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
      content: ''
    }
  },
  methods: {
    getContent: function(page = this.$router.currentRoute.params.page) {
      this.$http.get(`/static/markdown/${page}.md`)
        .then(response => {
          this.content = response.data
        })
        .catch(error => { console.log(error) })
    }
  },
  created() {
    this.getContent()
  },
  beforeRouteUpdate(to, from, next) {
    this.getContent(to.params.page)
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
