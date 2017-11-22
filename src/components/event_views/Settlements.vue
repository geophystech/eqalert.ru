<template>
  <div class="settlements">
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

<style scoped>
</style>
