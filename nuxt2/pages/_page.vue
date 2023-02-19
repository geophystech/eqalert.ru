<template>
  <div>
    <VueMarkdown :source="content" class="static-page-content" @rendered="onRendered" />
    <b-modal
      ref="mapDialog"
      title="Карта сейсмических станций"
      :no-close-on-backdrop="true"
      :hide-footer="true"
      :lazy="true"
      size="lg"
      @shown="onMapDialogOpen"
    >
        <MainpageMap ref="map" :onlyStations="true" :gestureHandling="false" />
    </b-modal>
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import mixins from '@/mixins/_page'

export default {
  name: 'static-page',
  components: {
    VueMarkdown,
    MainpageMap: () => process.client ? import('@/components/Map/Mainpage.vue') : null,
  },
  data() {
    return {
      page: this.$router.currentRoute.params.page,
      pages: {
        about: 'О проекте'
      }
    }
  },
  mixins: [mixins],
  head() {
    return {
      title: this.htmlTitle,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.content
        },
      ]
    }
  },
  methods: {
    getContent() {
      this.$axios.get(`/markdown/${this.page}.md`).then(response => {
        this.content = response.data
      })
    },
    onRendered() {
      !this.$el || setTimeout(() => {
        this.$el.querySelector('.mainpage-map-link').addEventListener('click', e => {
          e.preventDefault()
          this.$refs.mapDialog.show()
        })
      })
    },
    onMapDialogOpen() {
      this.$refs.map.map.object.invalidateSize()
    }
  },
  beforeRouteUpdate(to, from, next) {
    this.page = to.params.page
    this.getContent()
    next()
  }
}
</script>

<style lang="scss" scoped>

@import 'assets/scss/_variables';
@import 'assets/scss/_mixins';
@import 'assets/scss/_modal_map.scss';

.static-page-content /deep/
{
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
