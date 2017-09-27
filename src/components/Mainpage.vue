<template>
  <div class="mainpage">
    <AppMap shouldDrawLastEvents="true" />
  </div>
</template>

<script>
import AppMap from '@/components/AppMap'

export default {
  name: 'mainpage',
  components: { AppMap }
}
</script>

<style scoped>
</style>
