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
    getContent: function() {
      const page = this.$router.currentRoute.params.page
      this.$http.get(`/static/markdown/${page}.md`)
        .then(response => {
          this.content = response.data
        })
        .catch(error => { console.log(error) })
    },
    customTags: function() {
      console.log('called!')
    }
  },
  created() {
    this.getContent()
  }
}
</script>

<style lang="scss">
  @import '../assets/scss/global.scss';

  h1, h2, h3, h4, h5, h6 {
    text-align: center !important;
  }

  img {
    max-width: 100%;
  }

  .static-page {
    margin-top: 3%;
  }
</style>
