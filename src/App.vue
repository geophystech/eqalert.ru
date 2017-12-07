<template>
  <div id="app">
    <b-container>
      <app-header></app-header>
      <app-navbar></app-navbar>

      <router-view></router-view>

      <app-footer></app-footer>
    </b-container>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppNavbar from '@/components/AppNavbar'
import AppFooter from '@/components/AppFooter'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppNavbar,
    AppFooter
  }
}
</script>

<style lang="scss">
</style>
