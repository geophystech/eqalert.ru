<template>
  <div>
    <div class="static-page-content" @rendered="onRendered" v-html="content"></div>
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
import mixins from '@/mixins/about'

export default {
  name: 'static-page',
  components: {
    MainpageMap: () => process.client ? import('@/components/Map/Mainpage.vue') : null,
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
