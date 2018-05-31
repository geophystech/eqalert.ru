<template>
  <footer class="footer">
  	<b-row no-gutters>
      <b-col>
        <b-row no-gutters id="copyright">
          © 2016 &mdash; {{ currentYear }} Eqalert.ru
        </b-row>
        <b-row no-gutters id="feedback">
          <a href="https://goo.gl/forms/i48vp55kTjL2d9Wk1">Обратная связь</a>
        </b-row>
      </b-col>

      <b-col class="d-flex justify-content-center" id="geophystech-website">
        <a href="https://geophystech.ru/">ООО "Геофизические технологии"</a>
      </b-col>

      <b-col class="d-flex justify-content-end" id="social-media-links">
        <a href="https://telegram.me/eqalert_ru_bot"><i class="fa fa-telegram" aria-hidden="true" /></a>
      </b-col>
    </b-row>
  </footer>
</template>

<script>
export default {
  name: 'app-footer',
  computed: {
    currentYear: function() {
      return (new Date()).getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '~scss/global';

  .footer {
    padding-bottom: 3%;
    padding-top: 3%;

    a {
      color: $color-gray-dark;
    }

    #social-media-links {
      a {
        font-size: 150%;
      }
    }
  }
</style>
