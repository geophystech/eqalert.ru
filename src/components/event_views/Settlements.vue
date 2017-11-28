<template>
  <div class="event-tab settlements">
    <AppMap :hashid="hashid" mapId="map-settlements" shouldDrawEpicenter="true" shouldDrawMsk64="true" target="settlements" />

    Ближайшие населенные пункты
  </div>
</template>

<script>
import AppMap from '@/components/AppMap'

export default {
  components: { AppMap },
  computed: {
    hashid: function() {
      return 'KEXKBvM0'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/event.scss';

</style>
