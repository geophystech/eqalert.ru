<template>
  <footer class="footer">
  	<b-row no-gutters>
      <b-col>
        <b-row no-gutters>
          © 2016 &mdash; {{ currentYear }} Eqalert.ru
        </b-row>
        <b-row no-gutters>
          <a href="https://goo.gl/forms/i48vp55kTjL2d9Wk1">Обратная связь</a>
        </b-row>
      </b-col>

      <b-col class="d-flex justify-content-center">
        <a href="https://geophystech.ru/">ООО "Геофизические технологии"</a>
      </b-col>

      <b-col class="d-flex justify-content-end">
        <a href="https://telegram.me/eqalert_ru_bot"><i class="fa fa-telegram" aria-hidden="true" /></a>
      </b-col>
    </b-row>
  </footer>
</template>

<script>
export default {
  name: 'app-footer',
  data() {
    return {
      currentYear: (new Date()).getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/global.scss';

  .footer {
    padding-bottom: 3%;
    padding-top: 3%;

    a {
      color: $color-gray-dark;
    }
  }
</style>
